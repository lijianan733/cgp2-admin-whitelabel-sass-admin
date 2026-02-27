/**
 * Created by nan on 2020/10/15
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.view.AttributeTreeCombo',
    'CGP.common.rttypetortobject.view.RtTypeToRtObjectFieldContainer'
])
Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.view.AssertantsGridField', {
    extend: 'Ext.ux.form.GridFieldWithCRUDV2',
    alias: 'widget.assertantsgridfield',
    profileStore: null,
    diyGetValue: function () {
        var me = this;
        var data = me.getSubmitValue();
        JSClearNullValue(data);
        return data;
    },
    diySetValue: function (data) {
        var me = this;
        me.setSubmitValue(data);
    },
    initComponent: function () {
        var me = this;
        me.gridConfig = {
            store: Ext.create('Ext.data.Store', {
                autoSync: true,
                fields: [
                    {name: 'nameKey', type: 'string'},
                    {name: 'productKey', type: 'string'},
                    {name: 'headerKey', type: 'string'},
                    {name: 'noticeKey', type: 'string'},
                    {name: 'clazz', type: 'string'},
                    {name: 'boardType', type: 'string'},
                    {name: 'navBarArea', type: 'string'},
                    {name: 'attributeEditors', type: 'array'},
                    {name: 'showStep', type: 'boolean'},
                    {name: 'showWhenInit', type: 'boolean'},
                    {name: 'qty', type: 'object'},
                    {name: 'maxQty', type: 'object'},
                    {name: 'showColorModel', type: 'boolean'},
                    {name: 'front', type: 'object'},
                    {name: 'back', type: 'object'},
                    {name: 'option', type: 'object'},
                    {name: 'model', type: 'object'}
                ],
                data: []
            }),
            columns: [
                {
                    text: i18n.getKey('nameKey'),
                    dataIndex: 'nameKey',
                    tdCls: 'vertical-middle'
                },
                {
                    text: i18n.getKey('clazz'),
                    dataIndex: 'clazz',
                    flex: 1,
                    tdCls: 'vertical-middle',
                    renderer: function (value, mateData, record) {
                        return value.split('.').pop();
                    }
                },
            ]
        };
        var profileStore = me.profileStore || Ext.data.StoreManager.get('profileStore');
        me.winConfig = {
            formConfig: {
                width: '100%',
                defaults: {
                    width: 450,
                    allowBlank: true,
                    margin: '5 25 5 25'
                },
                items: [
                    {
                        xtype: 'combo',
                        editable: false,
                        name: 'clazz',
                        itemId: 'type',
                        valueField: 'value',
                        displayField: 'display',
                        fieldLabel: i18n.getKey('type'),
                        mappings: {
                            common: ['nameKey', 'productKey', 'headerKey', 'noticeKey', 'clazz'],
                            'com.qpp.cgp.domain.product.config.view.builder.config.SimplePreviewBoard': ['boardType', 'navBarArea'],
                            'com.qpp.cgp.domain.product.config.view.builder.config.QtySameDifferentEditor': [
                                'qty', 'maxQty', 'showColorModel', 'front', 'back'
                            ],
                            'com.qpp.cgp.domain.product.config.view.builder.config.SimpleOptionEditor': [
                                'option'
                            ],
                            'com.qpp.cgp.domain.product.config.view.builder.config.PlayingCardEditor': [],
                            'com.qpp.cgp.domain.product.config.view.builder.config.CommonPropertyModelEditor': [
                                'attributeEditors',
                                'showStep',
                                'showWhenInit'
                            ],
                            'com.qpp.cgp.domain.product.config.view.builder.config.RuntimeModelEditor': [
                                'model'
                            ]
                        },
                        value: 'com.qpp.cgp.domain.product.config.view.builder.config.SimplePreviewBoard',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'display'],
                            data: [
                                {
                                    value: 'com.qpp.cgp.domain.product.config.view.builder.config.SimplePreviewBoard',
                                    display: 'SimplePreviewBoard'
                                },
                                {
                                    value: 'com.qpp.cgp.domain.product.config.view.builder.config.QtySameDifferentEditor',
                                    display: 'QtySameDifferentEditor'
                                },
                                {
                                    value: 'com.qpp.cgp.domain.product.config.view.builder.config.SimpleOptionEditor',
                                    display: 'SimpleOptionEditor'
                                },
                                {
                                    value: 'com.qpp.cgp.domain.product.config.view.builder.config.PlayingCardEditor',
                                    display: 'PlayingCardEditor'
                                }, {
                                    value: 'com.qpp.cgp.domain.product.config.view.builder.config.CommonPropertyModelEditor',
                                    display: 'CommonPropertyModelEditor'
                                },
                                {
                                    value: 'com.qpp.cgp.domain.product.config.view.builder.config.RuntimeModelEditor',
                                    display: 'RuntimeModelEditor'
                                }
                            ]
                        }),
                        listeners: {
                            change: function (combo, newValue, oldValue) {
                                var mapping = combo.mappings;
                                var form = combo.ownerCt;
                                for (var i = 0; i < form.items.items.length; i++) {
                                    var item = form.items.items[i];
                                    var name = item.getName();
                                    if (Ext.Array.contains(mapping.common, name)) {


                                    } else if (Ext.Array.contains(mapping[newValue], name)) {
                                        item.show();
                                        item.setDisabled(false);

                                    } else {
                                        item.hide();
                                        item.setDisabled(true);
                                    }
                                }
                            }
                        }
                    },
                    {
                        name: 'nameKey',
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('component') + i18n.getKey('displayName'),
                        itemId: 'nameKey',
                        allowBlank: false,
                        valueField: 'value',
                        displayField: 'display',
                        editable: true,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'display'],
                            data: [{
                                value: 'CHANGE_LAYOUT',
                                display: 'CHANGE_LAYOUT'
                            }, {
                                value: 'PREVIEW',
                                display: 'PREVIEW'
                            }]
                        })
                    },
                    {
                        name: 'productKey',
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('product') + i18n.getKey('type'),
                        itemId: 'productKey',
                        valueField: 'value',
                        displayField: 'display',
                        editable: true,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'display'],
                            data: [{
                                value: 'TILES',
                                display: 'TILES'
                            }]
                        })
                    },
                    {
                        name: 'headerKey',
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('title') + i18n.getKey('info'),
                        itemId: 'headerKey',
                        valueField: 'value',
                        displayField: 'display',
                        editable: true,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'display'],
                            data: [{
                                value: 'CHANGE_LAYOUT_HEADER',
                                display: 'CHANGE_LAYOUT_HEADER'
                            }, {
                                value: 'PREVIEW_HEADER',
                                display: 'PREVIEW_HEADER'
                            }]
                        })
                    },
                    {
                        name: 'noticeKey',
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('prompt') + i18n.getKey('info'),
                        itemId: 'noticeKey',
                        valueField: 'value',
                        displayField: 'display',
                        editable: true,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'display'],
                            data: [{
                                value: 'CHANGE_LAYOUT_NOTICEKEY',
                                display: 'CHANGE_LAYOUT_NOTICEKEY'
                            }, {
                                value: 'PREVIEW_NOTICEKEY',
                                display: 'PREVIEW_NOTICEKEY'
                            }]
                        })
                    },
                    {
                        name: 'boardType',
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('boardType'),
                        itemId: 'boardType',
                        editable: true,
                        valueField: 'value',
                        displayField: 'display',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'value',
                                'display'
                            ],
                            data: [
                                {
                                    value: 'singleViewPreviewBoard',
                                    display: i18n.getKey('singleViewPreviewBoard')
                                }
                            ]
                        })
                    },
                    {
                        name: 'navBarArea',
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('navBarArea'),
                        itemId: 'navBarArea',
                        editable: true,
                        valueField: 'value',
                        displayField: 'display',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'value',
                                'display'
                            ],
                            data: [
                                {
                                    value: 'top',
                                    display: i18n.getKey('top')
                                }, {
                                    value: 'bottom',
                                    display: i18n.getKey('bottom')
                                }
                            ]
                        })
                    },
                    {
                        name: 'qty',
                        xtype: 'attributetreecombo',
                        hidden: true,
                        disabled: true,
                        profileStore: profileStore,
                        fieldLabel: i18n.getKey('属性选择器(qty)'),
                        itemId: 'qty',
                    },
                    {
                        name: 'maxQty',
                        xtype: 'attributetreecombo',
                        hidden: true,
                        disabled: true,
                        profileStore: profileStore,
                        fieldLabel: i18n.getKey('属性选择器(maxQty)'),
                        itemId: 'maxQty',
                    },
                    {
                        name: 'showColorModel',
                        xtype: 'combo',
                        hidden: true,
                        disabled: true,
                        fieldLabel: i18n.getKey('showColorModel'),
                        itemId: 'showColorModel',
                        editable: false,
                        valueField: 'value',
                        displayField: 'display',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                {
                                    name: 'value',
                                    type: 'boolean'
                                }, 'display'
                            ],
                            data: [
                                {
                                    value: true,
                                    display: 'true'
                                },
                                {
                                    value: false,
                                    display: 'false'
                                }
                            ]
                        })
                    },
                    {
                        name: 'front',
                        xtype: 'attributetreecombo',
                        profileStore: profileStore,
                        hidden: true,
                        disabled: true,
                        fieldLabel: i18n.getKey('front'),
                        itemId: 'front',
                    },
                    {
                        name: 'back',
                        xtype: 'attributetreecombo',
                        profileStore: profileStore,
                        hidden: true,
                        disabled: true,
                        fieldLabel: i18n.getKey('back'),
                        itemId: 'back',
                    },
                    {
                        name: 'option',
                        xtype: 'attributetreecombo',
                        profileStore: profileStore,
                        hidden: true,
                        disabled: true,
                        fieldLabel: i18n.getKey('option'),
                        itemId: 'option',
                    },
                    {
                        name: 'attributeEditors',
                        xtype: 'attributetreecombo',
                        profileStore: profileStore,
                        multiselect: true,
                        hidden: true,
                        disabled: true,
                        fieldLabel: i18n.getKey('attributeEditors'),
                        itemId: 'attributeEditors',
                    },
                    {
                        name: 'showStep',
                        xtype: 'textfield',
                        hidden: true,
                        disabled: true,
                        fieldLabel: i18n.getKey('showStep'),
                        itemId: 'showStep',
                        editable: false,
                        valueField: 'value',
                        displayField: 'display',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                {
                                    name: 'value',
                                    type: 'boolean'
                                }, 'display'
                            ],
                            data: [
                                {
                                    value: true,
                                    display: 'true'
                                },
                                {
                                    value: false,
                                    display: 'false'
                                }
                            ]
                        })
                    },
                    {
                        name: 'showWhenInit',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('showWhenInit'),
                        itemId: 'showWhenInit',
                        editable: false,
                        valueField: 'value',
                        hidden: true,
                        disabled: true,
                        displayField: 'display',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                {
                                    name: 'value',
                                    type: 'boolean'
                                }, 'display'
                            ],
                            data: [
                                {
                                    value: true,
                                    display: 'true'
                                },
                                {
                                    value: false,
                                    display: 'false'
                                }
                            ]
                        })
                    },
                    {
                        xtype: 'rttypetortobjectfieldcontainer',
                        itemId: 'model',
                        name: 'model',
                        width: 800,
                        allowBlank: false,
                        hidden: true,
                        disabled: true,
                        maxHeight: 250,
                        fieldLabel: i18n.getKey('template') + i18n.getKey('config'),
                        rtTypeAttributeInputFormConfig: {
                            xtype: 'rttypetortobjectformv2',
                            hideRtType: false,
                            maxHeight: 250,
                            rtTypeTreeStore:Ext.data.StoreManager.get('rtTypeTreeStore')
                        }
                    }
                ]
            }
        };
        me.callParent();
    },

})