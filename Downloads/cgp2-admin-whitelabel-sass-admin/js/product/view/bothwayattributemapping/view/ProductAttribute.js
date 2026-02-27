/**
 * Created by admin on 2019/11/20.
 */
Ext.define('CGP.product.view.bothwayattributemapping.view.ProductAttribute', {
    extend: 'Ext.ux.form.GridField',
    alias: 'widget.skuattrgridfield',
    requires: ['CGP.attribute.model.AttributeOption'],
    bodyStyle: {
        padding: '10px'
    },

    initComponent: function () {
        var me = this;
        me.gridConfig = {
            renderTo:me.mappingType,
            height:240,
            autoScroll: true,
            scroll: 'vertical',
            store: Ext.create('CGP.product.view.bothwayattributemapping.store.ProductAttribute'),
            selModel: Ext.create('Ext.selection.CheckboxModel', {
                mode: "SIMPLE",
                showHeaderCheckbox : false,
                checkOnly: true
            }),
            multiSelect: true,
            hideHeaders:true,
            viewConfig: {
                stripeRows:true
            },
            tbar: [
                {
                    xtype: 'displayfield',
                    value: i18n.getKey(me.mappingType)
                },
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('add'),
                    iconCls: 'icon_add',
                    handler: function (btn) {
                        var selectedSkuAttr=[];
                        var items=me.ownerCt.items.items;
                        Ext.Array.each(items,function(item){
                           if(item.xtype == 'skuattrgridfield'){//&&item.itemId!=me.itemId
                                selectedSkuAttr=Ext.Array.merge(selectedSkuAttr,item.getSubmitValue().map(function(item){
                                    return item.id;
                                }));
                           }
                        });

                        Ext.create('CGP.product.view.bothwayattributemapping.view.SkuAttributeSelectWindow', {
                            selectedGrid: me,
                            selectAttribute:me.skuAttributeStore,
                            selectedSkuAttr:selectedSkuAttr
                        }).show();
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('delete'),
                    iconCls: 'icon_bullet_delete',
                    handler: function (btn) {
                        var selecteds = me.gridConfig.selModel.getSelection();
                        if (!Ext.isEmpty(selecteds)) {
                            Ext.Msg.confirm(i18n.getKey('info'),i18n.getKey('deleteConfirm'), function (select) {
                                if (select == 'yes') {
                                    var store = me.getStore();
                                    Ext.each(selecteds, function (record) {
//                                        //添加备选数据
//                                        me.skuAttributeStore.add(record);
                                        //删除已选数据
                                        store.remove(record);
                                    });
                                }
                            });

                        }
                    }
                }
            ],
            columns: [
                {
                    //header: i18n.getKey('value'),
                    xtype: 'componentcolumn',
                    dataIndex: 'attributeName',
                    width: 300,
                    flex: 1,
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        return value
                    }
                }
            ]
        };
        me.callParent();
    }
})
