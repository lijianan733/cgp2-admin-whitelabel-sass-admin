/**
 * Created by admin on 2019/11/26.
 */
Ext.define('CGP.product.view.bothwayattributemapping.view.AttributeValueGrid', {
    extend: 'Ext.ux.form.GridField',
    alias: 'widget.attrgridfield',
    requires: ['CGP.attribute.model.AttributeOption'],
    bodyStyle: {
        padding: '10px'
    },

    initComponent: function () {
        var me = this;
//        var gridData=[{
//            "leftValues" : [],
//            "rightValues" : []
//        }];
//        me.leftAttribute.getSubmitValue()
        me.gridConfig = {
            autoScroll: true,
            renderTo:me.mappingType,
            scroll: 'vertical',
            store: Ext.create("CGP.product.view.bothwayattributemapping.store.TwoWayAttributeMappingGrid",{
                model: "CGP.product.view.bothwayattributemapping.model.TwoWayAttributeMappingGrid",
                autoSync : true,
                data:{},
                proxy : {
                    type : 'memory'
                }
            }),
            disableSelection:true,
            hideHeaders:true,
            viewConfig: {
                overCls:'',
                overItemCls:'',
                stripeRows:true
            },
            columns: [
                {
                    xtype: 'componentcolumn',
                    header: 'index',
                    dataIndex: 'index',
                    sortable: false,
                    width:20,
                    tdCls: 'vertical-middle',
                    renderer: function (value, metadata, record,rowIndex) {
                        return {
                            xtype:'displayfield',
                            value:rowIndex+1
                        }
                    }
                },
                {
                    //header: i18n.getKey('value'),
                    xtype: 'componentcolumn',
                    dataIndex: 'skuAttribute',
                    flex: 1,
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        return Ext.create('CGP.product.view.bothwayattributemapping.view.AttributeValueMappingContainer', {
                            mappingData: record.data,
                            width: 900,
                            leftAttribute:me.leftAttribute,
                            rightAttribute:me.rightAttribute,
                            productId: me.productId
                        });
                    }
                },
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    width: 30,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    align:'center',
                    tdCls: 'vertical-middle',
                    items: [
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                if(store.getCount()==1){
                                    Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('keepAtLeastOne')+i18n.getKey('mapping') + i18n.getKey('rule'));
                                    return false;
                                }
                                Ext.Msg.confirm(i18n.getKey('info'),i18n.getKey('deleteConfirm'), function (select) {
                                    if (select == 'yes') {
                                        store.removeAt(rowIndex);
                                    }
                                });

                            }
                        }
                    ]
                }
            ],
            tbar: [
//                {
//                    xtype: 'displayfield',
//                    value: i18n.getKey('mappingType')
//                },
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('add'),
                    iconCls: 'icon_add',
                    handler: function (btn) {
                        var attValueGrid=btn.ownerCt.ownerCt;
                        var maxIndex=Ext.num(attValueGrid.store.max('index'), 0);
                        attValueGrid.store.add({index:maxIndex+1});
                    }
                }
            ]
        };
        me.callParent();
    },
    getValue: function () {

    },
    getErrors:function(){
        var me=this,errors={};

        me.gridConfig.store.each(function(record){
            if(Ext.isEmpty(record.getData()['leftValues'])){
                errors['leftAttributevalue:']=i18n.getKey('not be null!')
            }
            else if(Ext.isEmpty(record.getData()['rightValues'])){
                errors['rightAttributevalue:']=i18n.getKey('not be null!')
            }
        });

    }
})
