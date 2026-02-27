/**
 * Created by nan on 2019/10/21.
 * 没有约束，可以重复选择
 */
Ext.define('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.SelectAttributeWindow', {
    extend: 'Ext.window.Window',
    productId: null,
    modal: true,
    requires: ['CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.model.Attribute'],
    constrain: true,
    layout: 'fit',
    title: i18n.getKey('选择属性'),
    fieldPanel: null,
    itemId: 'selectAttributeWindow',
    gridCfg: null,
    saveHandler: null,//保存时的处理方法
    productAttributeStore: null,
    constructor: function (config) {
        var me = this;
        config.bbar = config.bbar || [
            "->",
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_save',
                handler: config.saveHandler || function (btn) {

                }
            },
            {
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function (btn) {
                    btn.ownerCt.ownerCt.close();
                }
            }];
        me.callParent(arguments);
    },

    initComponent: function () {
        var me = this;
        me.productAttributeStore = me.productAttributeStore || Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.store.ProductAttributeStore', {
            productId: me.productId
        });
        me.items = [
            Ext.Object.merge({
                xtype: 'grid',
                store: me.productAttributeStore,
                width: 800,
                height: 500,
                itemId: 'attributeGrid',
                multiSelect: false,
                selModel: Ext.create("Ext.selection.CheckboxModel", {
                    mode: 'multi',//multi,simple,single；默认为多选multi
                    checkOnly: true,
                    allowDeselect: true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
                    showHeaderCheckbox: true//如果此项为false在复选框列头将不显示.
                }),
                viewConfig: {
                    enableTextSelection: true,
                    stripeRows: true
                },
                columns: [
                    {
                        dataIndex: 'id',
                        width: 80,
                        text: i18n.getKey('id')
                    },
                    {
                        dataIndex: 'displayName',
                        text: i18n.getKey('displayName'),
                        width: 200
                    },
                    {
                        dataIndex: 'code',
                        text: i18n.getKey('code'),
                        renderer: function (value, metadata, record) {
                            var isSku = record.get('isSku');
                            if (isSku) {
                                return record.get('attribute').code;
                            } else {
                                return value;
                            }
                        }
                    },
                    {
                        dataIndex: 'name',
                        text: i18n.getKey('name'),
                        renderer: function (value, metadata, record) {
                            var isSku = record.get('isSku');
                            if (isSku) {
                                return record.get('attribute').name;
                            } else {
                                return value;
                            }
                        }
                    },
                    {
                        dataIndex: 'inputType',
                        text: i18n.getKey('inputType'),
                        renderer: function (value, metadata, record) {
                            var isSku = record.get('isSku');
                            if (isSku) {
                                return record.get('attribute').inputType;
                            } else {
                                return value;
                            }
                        }
                    },
                    {
                        text: i18n.getKey('options'),
                        dataIndex: 'options',
                        itemId: 'options',
                        flex: 1,
                        renderer: function (value, metadata, record) {
                            var isSku = record.get('isSku');
                            if (isSku) {
                                value = record.get('attribute').options;
                            }
                            var v = [];
                            Ext.Array.each(value, function (data) {
                                v.push(data.name);
                            })
                            //是颜色option 展示颜色块
                            if (record.get('attribute').inputType == 'Color') {
                                var color = [];
                                Ext.Array.each(v, function (c) {

                                    color.push(c.split(':')[0] + '<a class=colorpick style="background-color:' + c.split(':')[1] + '"></a>');

                                })
                                v = color;
                            }
                            v = v.join(',');
                            return v;
                        }
                    }
                ]
            }, me.gridCfg)
        ];
        me.callParent();
    }
})
