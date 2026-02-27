Ext.define("CGP.test.pcCompare.view.CachePicturePcPanel", {
    extend: "Ext.panel.Panel",
    //title: i18n.getKey('pc数据'),
    region: 'center',
    itemId: 'cachePicturePcPanel',
    width: '25%',
    minWidth: 250,
    layout: {
        type: 'border'
    },
    //split: true,
    //collapsible: true,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.test.pcCompare.controller.Controller');
        me.items = [];
        var pcDataTree = Ext.create('CGP.test.pcCompare.view.PCDataTree', {
            region: 'north',
            height: me.compareType == 'cacheImageCompare' ? '100%' : '50%',
            compareType: me.compareType
        });

        var orderId = JSGetQueryString('orderId');
        var orderItemId = JSGetQueryString('orderItemId');
        var impressionVersion = JSGetQueryString('impressionVersion');
        if (me.compareType != 'cacheImageCompare') {
            var pictureView = Ext.create('CGP.test.pcCompare.view.PictureView', {
                itemId: 'pictureView',
                compareType: me.compareType
            });
            //var jobs = controller.getComposingJobs(orderId,orderItemId);
            me.jobStore = Ext.create('Ext.data.Store', {
                fields: ["name", "value"],
                proxy: 'memory',
                data: []
            });
            var jobPages = [];
            var picturePanel = Ext.create('Ext.panel.Panel', {
                region: 'south',
                height: '50%',
                layout: 'fit',
                title: i18n.getKey('排版Page'),
                itemId: 'pictureViewPanel',
                items: [pictureView],
                refreshData: function () {
                    var jobType = this.down('toolbar').getComponent('jobType');
                    var preview = this.getComponent('pictureView');
                    /*var jobs = */
                    controller.getComposingJobs(orderId, orderItemId, this, jobType, preview, impressionVersion);
                    //jobPages = controller.getComposingPages();
                    /*this.down('toolbar').getComponent('jobType').setValue(jobs[0].value);
                    this.getComponent('pictureView').refreshData(jobs);*/
                },
                listeners: {
                    afterrender: function (comp) {
                        comp.refreshData();
                    }
                },
                tbar: [{
                    name: 'jobType',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('job') + i18n.getKey('category'),
                    store: me.jobStore,
                    hidden: false,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'value',
                    itemId: 'jobType',
                    editable: false,
                    listeners: {
                        change: function (combo, newValue, oldValue) {
                            var jobPages = controller.getComposingPages();
                            pictureView.store.removeAll();
                            pictureView.store.add(jobPages[newValue]);
                        }
                    }
                }, {
                    margin: '0 0 0 12',
                    xtype: 'displayfield',
                    labelStyle: 'font-weight: bold',
                    labelWidth: 40,
                    hidden: true,
                    itemId: 'status',
                    value: '无排版page',
                    fieldStyle: 'color:red;font-weight: bold'
                }],
                getValue: function () {
                    return this.getComponent('pictureView').getValues();
                },
                compareType: 'cacheImageCompare'
            });
            picturePanel.addEvents(
                'selected'
            );
        }


        var finalItems = [];
        if (me.compareType == 'cacheImageCompare') {
            finalItems = [pcDataTree];
        } else {
            finalItems = [pcDataTree, picturePanel];
        }
        me.items = finalItems;

        me.callParent(arguments);
    },
    refreshData: function (pageContent, productInstance, haveCachePicture, comparePicture) {
        var me = this;
        me.pageContent = pageContent;
        me.haveCachePicture = haveCachePicture;
        me.comparePicture = comparePicture;
        var myMask = me.setLoading();
        Ext.Ajax.request({
            url: adminPath + 'api/pageContents/' + pageContent._id,
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                var data = responseMessage.data;
                if (responseMessage.success) {
                    if (myMask != undefined) {
                        myMask.hide();
                    }
                    Ext.Array.each(me.items.items, function (item) {
                        if (item.itemId == 'pictureViewPanel') {
                            //item.refreshData(productInstance);
                        } else {
                            item.refreshData(data, haveCachePicture, comparePicture);
                        }

                    });
                } else {
                    if (myMask != undefined) {
                        myMask.hide();
                    }
                    Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                }
            },
            failure: function (resp) {
                if (myMask != undefined) {
                    myMask.hide();
                }
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });

    }

});
