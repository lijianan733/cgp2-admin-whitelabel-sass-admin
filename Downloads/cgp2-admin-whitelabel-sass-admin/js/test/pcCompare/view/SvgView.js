Ext.define('CGP.test.pcCompare.view.PictureView', {
    extend: 'Ext.view.View',
    alias: 'widget.picturebrowser',

    uses: 'Ext.data.Store',
    region: 'south',
    singleSelect: true,
    autoScroll: true,
    overItemCls: 'x-view-over',
    itemSelector: 'div.thumb-wrap',
    title: i18n.getKey('可选图片'),
    tpl: [
        // '<div class="details">',
        '<tpl for=".">',
        '<div class="thumb-wrap">',
        (!Ext.isIE6? '<img src='+projectThumbServer+'{fileName}/100/100 width="100" height="100"/> ' :
            '<div style="width:74px;height:74px;></div>'),
        '</div>',
        //'<span>{fileName}</span>',
        '</div>',
        '</tpl>'
        // '</div>'
    ],

    initComponent: function() {
        var me = this;
        me.controller = Ext.create('CGP.test.pcCompare.controller.Controller');
        this.store = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: ['file', 'width', 'height',{
                name: 'fileName',
                type: 'string',
                convert:function (value,record) {
                    return record.get('file').split("/").pop();
                }
            }],
            proxy: 'memory',
            data: []
        });
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
                me.controller.updateBuilderPcData(pageContent,pictures[0],'cacheImageCompare');
                pcCompareBuilder.refreshData();
            }else if(!Ext.isEmpty(pictures) && !Ext.isEmpty(pcDatas) && pcCompareBuilder.state == 'release'){
                pcCompareBuilder.refreshData();
            }
            //this.hide();
        }
    },
    onIconSelect: function(dataview, selections) {
        var selected = selections[0];

        if (selected) {
            //this.down('infopanel').loadRecord(selected);
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
    refreshData: function (productInstance) {
        var me = this;
        me.controller = Ext.create('CGP.test.pcCompare.controller.Controller');
        var pictures = me.controller.getMvCachePictrues(productInstance.builderCache);
        me.store.removeAll();
        me.store.add(pictures);
    }
});