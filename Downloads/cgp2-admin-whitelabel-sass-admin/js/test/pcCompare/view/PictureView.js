Ext.define('CGP.test.pcCompare.view.PictureView', {
    extend: 'Ext.view.View',
    alias: 'widget.picturebrowser',

    uses: 'Ext.data.Store',

    singleSelect: true,
    autoScroll: true,
    overItemCls: 'x-view-over',
    itemSelector: 'div.thumb-wrap',
    selectedItemCls: 'x-item-selected',
    title: i18n.getKey('可选图片'),
    /*tpl: [
        // '<div class="details">',
        '<tpl for=".">',
        '<div class="thumb"">',
        '<div class="thumb-wrap" style="display:inline-block;width:108px;height:108px;float:left;">',
        (!Ext.isIE6? '<embed src='+imageServer+'{file}/100/100 type="image/svg+xml" style="float:left;width:100px; height:100px;position: absolute;"/>' :
            '<div style="width:74px;height:74px;></div>'),
        '<a style="display:block;position:absolute;width:102px;height:102px;float:left;" href="#"></a>',
        //'<span>{productMaterialView.name}</span>',
        '</div>',
        '</div>',
        '</tpl>'
        // '</div>'
    ],*/
    tpl: [
        // '<div class="details">',
        '<tpl for=".">',
        '<div class="thumb-wrap">',
        '<div class="thumb">',
        (!Ext.isIE6? '<img src='+imageServer+'{file}/100/100 style="width:100px; height:100px;" />' :
            '<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'icons/{thumb}\')"></div>'),
        '</div>',
        '<span>{imageName}</span>',
        '</div>',
        '</tpl>'
        // '</div>'
    ],

    initComponent: function() {
        var me = this;
        me.controller = Ext.create('CGP.test.pcCompare.controller.Controller');
        this.store = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: ['pngFile', 'width', 'height',{'name': 'file',type: 'string',convert: function (value) {
                    return value.split('/').pop() ;
                }},{name: 'productMaterialView',type: 'object'},{
                'name': 'imageName',type: 'string',convert: function (value,record) {
                    var productMaterialView = record.get('productMaterialView');
                    if(!Ext.Object.isEmpty(productMaterialView)){
                        return productMaterialView.name;
                    }else{
                        return '';
                    }
                }
            }],
            proxy: 'memory',
            data: []
        });


        /*me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            itemId: 'viewToolbar',
            items: [
                {
                    name: 'jobType',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('job')+i18n.getKey('category'),
                    store: me.jobStore,
                    hidden: false,
                    displayField: 'name',
                    valueField: 'value',
                    itemId: 'jobType',
                    editable: false,
                    listeners: {
                        change: function (combo, newValue,oldValue) {
                            me.store.removeAll();
                            me.store.add(me.controller.jobPages[newValue]);
                        }
                    }
                },{
                    margin: '0 0 0 12',
                    xtype: 'displayfield',
                    labelStyle: 'font-weight: bold',
                    labelWidth: 40,
                    hidden: true,
                    itemId: 'status',
                    value: '无排版page',
                    fieldStyle: 'color:red;font-weight: bold'
                }
            ]
        }];*/
        me.listeners = {
            scope: this,
            selectionchange: this.onIconSelect,
            itemdblclick: this.fireImageSelected
        };
        this.callParent(arguments);
        //this.store.sort();
        this.addEvents(
            /**
             * @event selected
             * Fired whenever the user selects an image by double clicked it or clicking the window's OK button
             * @param {Ext.data.Model} image The image that was selected
             */
            'selected'
        );
    },
    fireImageSelected: function() {
        var me = this;
        var selectedImage = this.selModel.getSelection()[0];

        if (selectedImage) {
            this.fireEvent('selected', selectedImage);
            var pcCompareBuilder = me.ownerCt.ownerCt.getComponent('pcCompareBuilder');
            var pcDatas;
            var pcDataTree = me.ownerCt.getComponent('PCDataTree');
            if(me.compareType == 'cacheImageCompare'){
                pcDatas = pcDataTree.getChecked();
            }else{
                pcDatas = pcDataTree.getChecked();
            }
            var pictures = me.getValue();
            var pageContent = pcDataTree.getValue();
            if(!Ext.isEmpty(pictures) && !Ext.isEmpty(pcDatas) && pcCompareBuilder.state == 'initial'){
                me.controller.updateBuilderPcData(pageContent,pictures[0],me.compareType);
                pcCompareBuilder.refreshData();
            }else if(!Ext.isEmpty(pictures) && !Ext.isEmpty(pcDatas) && pcCompareBuilder.state == 'release'){
                pcCompareBuilder.refreshData();
            }
            //this.hide();
        }
    },
    onIconSelect: function(dataview, selections) {
        var me = this;
        var selected = selections[0];

        if (selected) {
            var pcCompareBuilder = me.ownerCt.ownerCt.ownerCt.getComponent('pcCompareBuilder');
            var pcDatas;
            var pcDataTree = me.ownerCt.ownerCt.getComponent('PCDataTree');
            if(me.compareType == 'cacheImageCompare'){
                pcDatas = pcDataTree.getChecked();
            }else{
                pcDatas = pcDataTree.getChecked();
            }
            var pictures = me.getValue().data;
            var pageContent = pcDataTree.getValue();
            if(!Ext.isEmpty(pictures) && !Ext.isEmpty(pcDatas) && pcCompareBuilder.state == 'initial'){
                me.controller.updateBuilderPcData(pageContent,pictures,me.compareType);
                pcCompareBuilder.refreshData();
            }else if(!Ext.isEmpty(pictures) && !Ext.isEmpty(pcDatas) && pcCompareBuilder.state == 'release'){
                pcCompareBuilder.refreshData();
            }
        }
    },
    getValue: function () {
        var me = this;
        var selection = me.selModel.getSelection()[0];
        return selection;
    },
    getValues: function(){
        var me = this;
        var selections = me.selModel.getSelection();
        return selections;
    },
    refreshData: function (jobs) {
        var me = this;
        var previewPanel = me.ownerCt;
        me.controller = Ext.create('CGP.test.pcCompare.controller.Controller');
        var orderId = JSGetQueryString('orderId');
        var orderItemId= JSGetQueryString('orderItemId');
        //var jobs = me.controller.getComposingJobs(orderId,orderItemId);
        var toolbar = previewPanel.down('toolbar');
        var statusDis = toolbar.getComponent('status');
        var jobType = toolbar.getComponent('jobType');
        if(Ext.isEmpty(jobs)){
            jobType.setVisible(false);
            statusDis.setVisible(true);
        }/*else{
            jobType.store.removeAll();
            jobType.store.add(jobs);
            jobType.setValue(jobs[0].value);
        }*/

    }
});