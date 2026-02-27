/**
 * Created by admin on 2019/10/29.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.ProfileAttributeSelectWindow', {
    extend: 'Ext.window.Window',
    requires: ['Ext.ux.ui.GridPage'],
    modal: true,
    resizable: false,
    constrain: true,
    /*minWidth: 500,
    height: 350,*/
    layout: 'fit',
    defaults: {
        width: 500
    },

    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('profile') + '<' + me.recordData.propertyPath.attributeProfile._id + '>' + i18n.getKey('attributes');
        var profileAttributes = [];
        Ext.Ajax.request({
            url: adminPath + 'api/attributeProfile/' + me.recordData.propertyPath.attributeProfile._id,
            method: 'GET',
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    if (resp.data.groups) {
                        Ext.Array.each(resp.data.groups, function (item) {
                            profileAttributes = Ext.Array.merge(profileAttributes, item.attributes);
                        });
                    }

                } else {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            }
        });
        var profileAttributeStore = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeGridStore', {
            model: 'CGP.product.view.managerskuattribute.model.SkuAttributeGridModel',
            data: profileAttributes,
            proxy: {
                type: 'memory'
            }
        });
        profileAttributeStore.filterBy(function (item) {
            if (me.treeGrid.valueType == 'Calculation') {
                return !Ext.Array.contains(me.selectedSkuAttr, item.getId()) && item.get('attribute').selectType == 'NON' && item.get('attribute').valueType == 'Number';
            } else {
                return !Ext.Array.contains(me.selectedSkuAttr, item.getId());
            }
        });
        me.items = [
            {
                xtype: 'grid',
                itemId: 'productSKUAtt',
                width: 530,
                height: 280,
                border: false,
                autoScroll: true,
                scroll: 'vertical',
                multiSelect: true,
                selModel: Ext.create('Ext.selection.CheckboxModel', {mode: "SIMPLE"}),
                store: profileAttributeStore,
                columnDefaults: {
                    tdCls: 'vertical-middle',
                    autoSizeColumn: true
                },
                listeners: {
                    afterrender: function (field) {//使两个gridcombo可选的内容互补
                        field.store.on('load',
                            function (fieldStore, records) {
                                field.store.filterBy(function (item) {
                                    return !Ext.Array.contains(me.selectedSkuAttr, item.getId());
                                });
                                Ext.Array.each(records, function (record) {
                                    var selectedGridAttr = Ext.Array.filter(me.selectedGrid.getSubmitValue(), function (item) {
                                        return item.skuAttributeId == record.getId();
                                    });
                                    if (selectedGridAttr.length > 0) {
                                        field.getSelectionModel().select(record);
                                    }
                                });
                            })
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
                    var wind = btn.ownerCt.ownerCt, selectedData = [];
                    var selecteds = wind.getComponent('productSKUAtt').getSelectionModel().getSelection();
                    Ext.Array.each(selecteds, function (record) {
                        var currentAttribute = Ext.clone(wind.recordData);
                        currentAttribute._id = JSGetCommonKey();
                        currentAttribute.propertyPath._id = JSGetCommonKey();
                        currentAttribute.propertyPath.skuAttributeId = record.data.id;
                        currentAttribute.propertyPath.skuAttribute = record.data;
                        currentAttribute.value = {
                            clazz: "com.qpp.cgp.domain.executecondition.operation.value.FixValue",
                            value: null
                        }
                        selectedData.push(currentAttribute);
                    });
                    if (selectedData.length > 0) {
                        me.treeGrid.setValue(selectedData);
                        wind.close();
                    } else {
                        Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('noSelect') + i18n.getKey('skuAttribute'))
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
});
