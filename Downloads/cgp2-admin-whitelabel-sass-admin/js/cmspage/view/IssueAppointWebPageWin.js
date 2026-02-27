/**
 * 发布指定网站页面时选择网站的窗口
 */
Ext.define('CGP.cmspage.view.IssueAppointWebPageWin',{
    extend: 'Ext.window.Window',

    width: 450,
    modal: true,
    layout: 'fit',
    bodyStyle: 'padding:10px',
    autoShow: true,
    initComponent: function(){
        var me = this;

        me.title = i18n.getKey('selectWebsite');
        var websitePublishStrategies = Ext.create('CGP.cmspage.store.WebsitePublishStrategies');
        var cmspublishStore = Ext.create('CGP.cmspage.store.CmsPublishStore');
        me.bbar= [
            '->', {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                handler: function cinfirm() {
                    if(me.form.isValid()) {
                        var data = {};
                        me.form.items.each(function(item){
                            data[item.name] =  item.getValue();
                        });
                        Ext.MessageBox.confirm('提示', '需生成的页面较多，等待时间较长，是否继续生成？', callBack);
                        function callBack(id) {
                            //var selected = me.getSelectionModel().getSelection();
                            if (id === "yes") {
                                me.tbarController.issueAppointWebPage(data,me);
                            }else{
                                close();
                            }
                        }
                    }
                }
            }, {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function (btn) {
                    me.close();
                }
            }];
        var form = {
            xtype: 'form',
            border: false,
            items: [{
                xtype: 'combo',
                itemId: 'websiteId',
                name: 'websiteId',
                width: 400,
                store: Ext.create('CGP.cmspage.store.Website'),
                editable: false,
                listeners: {
                    change: function(combo,newValue){
                        var lm = me.setLoading();
                        Ext.Ajax.request({
                            url: adminPath+'api/admin/cmsPage/static/copy/'+newValue+'/exportDir',
                            method: 'GET',
                            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                            success: function(res){
                                lm.hide();
                                var response = Ext.JSON.decode(res.responseText);
                                if(response.success == true){
                                    me.form.getComponent('issueExportDir').setValue(response.data);
                                }else{
                                    Ext.Msg.alert('提示',response.data.message);
                                }
                            },
                            failure: function(res){
                                lm.hide();
                                var response = Ext.JSON.decode(res.responseText);
                                Ext.Msg.alert('提示',response.data.message);
                            }
                        });
                        websitePublishStrategies.proxy.url = adminPath + 'api/admin/cmsSetting/'+newValue+'/publishStrategies';
                        websitePublishStrategies.load({
                            callback : function(records, options, success) {
                                lm.hide();
                                me.form.getComponent('publishStrategy').reset();
                                if(success == false){
                                    Ext.Msg.alert('提示','请求获取该网站发布策略失败!');
                                    me.form.getComponent('publishStrategy').setReadOnly(true);
                                }else{
                                    me.form.getComponent('publishStrategy').setReadOnly(false);
                                }
                            }
                        })
                    }
                },
                fieldLabel: i18n.getKey('website'),
                allowBlank: false,
                displayField: 'name',
                valueField: 'id',
                msgTarget: 'side'
            },{
                xtype: 'gridcombo',
                fieldLabel: i18n.getKey('publishStrategy'),
                allowBlank: false,
                displayField: 'title',
                valueField: 'key',
                itemId: 'publishStrategy',
                msgTarget: 'side',
                width: 400,
                store: websitePublishStrategies,
                editable: false,
                name: 'publishStrategy',
                pickerAlign: 'bl',
                listeners: {
                    expand: function(){
                        var websiteComboValue = this.ownerCt.getComponent('websiteId').getValue();
                        if(Ext.isEmpty(websiteComboValue)){
                            Ext.Msg.alert('提示','请先选择网站！');
                        }else{
                            websitePublishStrategies.proxy.url = adminPath + 'api/admin/cmsSetting/'+websiteComboValue+'/publishStrategies';
                            websitePublishStrategies.load();
                        }
                    }
                },
                gridCfg: {
                    store: websitePublishStrategies,
                    height: 200,
                    width:'100%',
                    columns: [{
                        text: i18n.getKey('title'),
                        width: '50%',
                        dataIndex: 'title'
                    },{
                        text: i18n.getKey('publishStrategy'),
                        width: '49%',
                        dataIndex: 'value',
                        renderer: function (value) {
                            var cmspublishModel = cmspublishStore.getById(parseInt(value));
                            return cmspublishModel.get('name');
                        }
                    }],
                    bbar : Ext.create('Ext.PagingToolbar', {
                        store : websitePublishStrategies,
                        displayInfo : true,
                        width: 275,
                        displayMsg : '',
                        emptyMsg : i18n.getKey('noData')
                    })
                }
            },{
                xtype: 'textfield',
                itemId: 'issueExportDir',
                name: 'exportDir',
                width: 400,
                fieldLabel: i18n.getKey('issueExportDir'),
                allowBlank: false,
                msgTarget: 'side'
            }]
        };
            me.items= [form];
            me.callParent(arguments);
        me.form = me.down('form');
    }
})