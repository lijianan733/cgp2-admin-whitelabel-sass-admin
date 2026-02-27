/**
 * Created by admin on 2019/11/21.
 */
Ext.define('CGP.product.view.bothwayattributemapping.view.SkuAttributeSelectWindow',{
    extend: 'Ext.window.Window',
    requires:['Ext.ux.ui.GridPage'],
    modal: true,
    resizable: false,
    minWidth: 500,
    height: 350,
    defaults: {
        width: 500
    },

    initComponent: function () {
        var me = this;
        me.title=i18n.getKey('attribute')+i18n.getKey('select');
        var controller=Ext.create("CGP.product.view.bothwayattributemapping.controller.Controller");
        me.selectAttribute.filterBy(function (item) {
            return !Ext.Array.contains(me.selectedSkuAttr,item.get('id'));
        });
        me.items = [
            {
                xtype:'grid',
                itemId:'productSKUAtt',
                width:530,
                height:280,
                border:false,
                autoScroll:true,
                scroll:'vertical',
                multiSelect:true,
                selModel:Ext.create('Ext.selection.CheckboxModel',{mode:"SIMPLE"}),
                store: me.selectAttribute,
                columnDefaults: {
                    tdCls: 'vertical-middle',
                    autoSizeColumn: true
                },
                listeners: {
//                    afterrender: function (field) {//使两个gridcombo可选的内容互补
//                        field.store.on('load',
//                            function (fieldStore,records) {
//                                field.store.filterBy(function (item) {
//                                    return !Ext.Array.contains(me.selectedSkuAttr,item.getId());
//                                });
//                                Ext.Array.each(records, function (record) {
//                                    var selectedGridAttr=Ext.Array.filter(me.selectedGrid.getSubmitValue(),function(item){
//                                        return item.skuAttributeId==record.getId();
//                                    });
//                                    if(selectedGridAttr.length>0){
//                                        field.getSelectionModel().select(record);
//                                    }
//                                });
//                            })
//                    },
                    load:function(store,records){
                        console.log('aaa');
                        var currSelecteds=me.selectedGrid.getSubmitValue();
                        if(!Ext.isEmpty(currSelecteds)){
                            me.getComponent('productSKUAtt').getSelectionModel().select(currSelecteds);
                        }
                    }
                },
                columns: [
                    {
                        text: i18n.getKey('id'),
                        width: 70,
                        dataIndex: 'id',
                        itemId: 'id',
                        sortable: true
                    },
                    {
                        text: i18n.getKey('code'),
                        dataIndex: 'attribute',
                        width: 100,
                        itemId: 'code',
                        renderer: function (value, metadata, record) {
                            return value.code;
                        }
                    },
                    {
                        text: i18n.getKey('name'),
                        dataIndex: 'attribute',
                        width: 100,
                        itemId: 'name',
                        renderer: function (value, metadata, record) {
                            return value.name;
                        }
                    },
                    {
                        text: i18n.getKey('valueType'),
                        dataIndex: 'attribute',
                        width: 80,
                        itemId: 'valueType',
                        renderer: function (value, metadata, record) {
                            return value.valueType;
                        }
                    },
                    {
                        text: i18n.getKey('值输入方式'),
                        dataIndex: 'attribute',
                        width: 120,
                        itemId: 'attribute',
                        sortable: true,
                        renderer: function (value, mate, record) {
                            if (value.selectType == 'NON') {
                                return '手动输入';
                            } else if (value.selectType == 'MULTI') {
                                return '多选';
                            } else {
                                return '单选';
                            }

                        }
                    }
                ]
            }
        ];
        me.bbar = ['->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                handler: function (btn) {
                    var wind=btn.ownerCt.ownerCt,selectedData=[];
                    var selecteds = wind.getComponent('productSKUAtt').getSelectionModel().getSelection();
                    Ext.Array.each(selecteds,function(record){
                        selectedData.push(record.data);
                        //删除gridfield record
                        me.selectAttribute.remove(record);
                    });
                    if(selectedData.length>0){
                        me.selectedGrid.gridConfig.store.loadData(selectedData,true);
                        wind.close();
                    }
                    else{
                        Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('noSelect')+i18n.getKey('skuAttribute'))
                    }
                }
            }, {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function () {
                    me.close();
                }
            }];
        me.callParent(arguments);
    }
})
