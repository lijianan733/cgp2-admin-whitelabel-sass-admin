/**
 * Created by admin on 2020/8/20.
 */
Ext.define('CGP.tools.freemark.template.view.TemplateModule', {
    extend: 'Ext.ux.form.GridField',
    alias: 'widget.variategrid',
    width: '100%',
    skuAttributeStore:null,
    data:null,
    requires : ['CGP.tools.freemark.template.model.TemplateModule'],

    initComponent: function () {
        var me = this;
        var controller=Ext.create('CGP.tools.freemark.template.controller.Controller');
        var inputStore=Ext.create('CGP.tools.freemark.template.store.TemplateModule',{
            storeId:'templateModuleStore'
        });
        me.gridConfig={
            renderTo:'inputGrid',
            store: inputStore,
            minHeight: 100,
            maxHeight: 300,
            tbar: [
                '<strong style="color: green;font-size: 110%">' + i18n.getKey('variableGroup') + '</strong>',
                //'->',
                {
                    text: i18n.getKey('add'),
                    iconCls: 'icon_add',
                    handler: function (btn) {
                        var productId=me.getProductComp();
                        controller.inputWind(me.gridConfig,null,productId);
                    }
                }
            ],
            columns: [
                {
                    xtype: 'rownumberer'
                },
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    dataIndex:'varKeys',
                    width: 60,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    items: [
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            handler: function (view, rowIndex, colIndex) {
                                Ext.Msg.confirm(i18n.getKey('info'),i18n.getKey('deleteConfirm'), function (select) {
                                    if (select == 'yes') {
                                        var store = view.getStore();
                                        store.removeAt(rowIndex);
                                    }
                                });
                            }
                        },
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: 'Edit',
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                var record = store.getAt(rowIndex);
                                var productId=me.getProductComp();
                                    controller.inputWind(view, record, productId);
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('varKeys'),
                    dataIndex: 'varKeys',
                    xtype: 'gridcolumn',
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        var val=Ext.Array.map(value,function(el){
                            return el.name;
                        });
                        metadata.tdAttr = 'data-qtip="' + val.join(',') + '"';
                        return val.join(',');
                    }
                },
                // {
                //     text: i18n.getKey('groups'),
                //     dataIndex: 'groups',
                //     xtype: 'gridcolumn',
                //     itemId: 'groups',
                //     flex: 1,
                //     renderer: function (value, metadata, record) {
                //         var val=Ext.Array.map(value,function(el){
                //             return el.name;
                //         });
                //         metadata.tdAttr = 'data-qtip="' + val.join(',') + '"';
                //         return val.join(',');
                //     }
                // }
            ]
        };
        me.callParent(arguments);
    },
    getProductComp:function (){
        var me=this;
        var productComp=me.ownerCt.getComponent('productId');
        var productId='';
        if(!Ext.isEmpty(productComp)&&productComp.getSubmitValue()){
            productId=productComp.getSubmitValue()[0];
        }
        return productId;
    }
})