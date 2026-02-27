/**
 * Created by nan on 2021/4/8
 */
Ext.define("CGP.productset.view.StaticProductScopeForm", {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.staticproductscopeform',
    isValidForItems: true,
    border: false,
    autoScroll: true,
    defaults: {
        width: 450,
        allowBlank: false,
        margin: 10
    },
    productSet: null,//关联的套件数据
    title: i18n.getKey('可选产品范围配置'),
    initComponent: function () {
        var me = this;
        var localStore = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'id',
                    type: 'int',
                    useNull: true
                },
                'model',
                'name',
                'sku',
                'type',
                {
                    name: 'mainCategory',
                    type: 'object'
                }, {
                    name: 'subCategories',
                    type: 'array'
                }, {
                    name: 'clazz',
                    type: 'string'
                }
            ],
            data: [],
            proxy: {
                type: 'pagingmemory'
            }
        });
        var websiteStore = Ext.create("CGP.common.store.Website");
        me.items = [
            {
                xtype: 'textfield',
                name: 'clazz',
                itemId: 'clazz',
                hidden: true,
            },
            {
                xtype: 'textfield',
                name: '_id',
                itemId: '_id',
                hidden: true,
                allowBlank: true,
                fieldLabel: i18n.getKey('_id'),
            },
            {
                xtype: 'textfield',
                name: 'name',
                itemId: 'name',
                fieldLabel: i18n.getKey('name'),
            },
            {
                xtype: 'textfield',
                name: 'description',
                itemId: 'description',
                fieldLabel: i18n.getKey('description'),
            },
            {
                xtype: 'uxfieldcontainer',
                name: 'setItem',
                hidden: true,
                allowBlank: false,
                itemId: 'setItem',
                items: [
                    {
                        name: '_id',
                        itemId: '_id',
                        xtype: 'textfield',
                    },
                    {
                        name: 'clazz',
                        itemId: 'clazz',
                        xtype: 'textfield',
                    }
                ]
            },
            {
                xtype: 'uxfieldset',
                title: "<font style= 'font-size:15px;color:green;font-weight: bold'>" + i18n.getKey('可选产品') + '</font>',
                collapsible: true,
                width: '100%',
                border: '1 0 0 0 ',
                layout: 'fit',
                itemId: 'products',
                name: 'products',
                collapsed: false,
                items: [
                    {
                        xtype: 'gridfieldhascomplementarydata',
                        name: 'products',
                        itemId: 'products',
                        allowBlank: true,
                        labelAlign: 'top',
                        width: '100%',
                        autoScroll: true,
                        valueSource: 'storeProxy',
                        /**
                         * 历史疑难问题，没救
                         */
                        diyGetValue: function () {
                            var me = this;
                            var data = me.getSubmitValue();
                            var result = [];
                            for (var i = 0; i < data.length; i++) {
                                result.push({
                                    id: data[i].id,
                                    type: data[i].clazz == 'com.qpp.cgp.domain.product.ConfigurableProduct' ? 'configurable' : 'sku',
                                    clazz: data[i].clazz
                                })
                            }
                            return result;
                        },
                        winTitle: i18n.getKey('optional') + i18n.getKey('product'),
                        dataWindowCfg: {
                            width: 950
                        },
                        searchGridCfg: {
                            gridCfg: {
                                editAction: false,
                                deleteAction: false,
                                storeCfg: {//配置store的所有参数，只是把创建store推后到新建弹窗时
                                    clazz: 'CGP.product.store.ProductStoreV2',
                                },
                                columns: [
                                    {
                                        text: i18n.getKey('id'),
                                        width: 120,
                                        dataIndex: 'id',
                                        itemId: 'id',
                                    },
                                    {
                                        text: i18n.getKey('type'),
                                        dataIndex: 'type',
                                        itemId: 'type',
                                        sortable: false
                                    },
                                    {
                                        text: i18n.getKey('name'),
                                        dataIndex: 'name',
                                        width: 250,
                                        itemId: 'name'
                                    },
                                    {
                                        text: i18n.getKey('model'),
                                        dataIndex: 'model',
                                        xtype: 'gridcolumn',
                                        width: 200,
                                        itemId: 'model'
                                    },
                                    {
                                        text: i18n.getKey('sku'),
                                        dataIndex: 'sku',
                                        autoSizeColumn: false,
                                        xtype: 'gridcolumn',
                                        flex: 1,
                                        itemId: 'sku',
                                        sortable: false,
                                        renderer: function (value, metadata) {
                                            metadata.tdAttr = 'data-qtip="' + value + '"';
                                            return value;
                                        }
                                    }
                                ],
                            },
                            filterCfg: {
                                header: false,
                                items: [
                                    {
                                        name: 'id',
                                        xtype: 'numberfield',
                                        hideTrigger: true,
                                        fieldLabel: i18n.getKey('id'),
                                        itemId: 'id'
                                    },
                                    {
                                        name: 'sku',
                                        xtype: 'textfield',
                                        fieldLabel: i18n.getKey('sku'),
                                        itemId: 'sku',
                                        listeners: {
                                            change: function (field, newValue, oldValue) {
                                                var type = field.ownerCt.getComponent('type');
                                                //type == configurable   需要为空 不能输入值
                                                if (type.getValue() == "Configurable") {
                                                    field.setValue('');
                                                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('CPNCSKUA') + '!');
                                                }
                                            }
                                        }
                                    },
                                    {
                                        name: 'type',
                                        xtype: 'combo',
                                        value: '',
                                        fieldLabel: i18n.getKey('type'),
                                        store: new Ext.data.Store({
                                            fields: ['name', 'value'],
                                            data: [
                                                {
                                                    name: 'Sku',
                                                    value: 'Sku'
                                                },
                                                {
                                                    name: 'Configurable',
                                                    value: 'Configurable'
                                                },
                                                {
                                                    name: i18n.getKey('allType'),
                                                    value: ''
                                                }
                                            ]
                                        }),
                                        displayField: 'name',
                                        valueField: 'value',
                                        itemId: 'type',
                                        editable: false,
                                        listeners: {
                                            select: function (combo, records) {
                                                if (records[0].get('value') == 'Configurable') {
                                                    combo.ownerCt.getComponent('sku').setValue('');
                                                }
                                            }
                                        }
                                    },
                                    {
                                        name: 'name',
                                        xtype: 'textfield',
                                        fieldLabel: i18n.getKey('name'),
                                        itemId: 'name'
                                    },
                                    {
                                        name: 'model',
                                        xtype: 'textfield',
                                        fieldLabel: i18n.getKey('model'),
                                        itemId: 'model'
                                    },
                                    {
                                        name: 'mainCategory.website.id',
                                        xtype: 'websitecombo',
                                        itemId: 'website',
                                        hidden: true,
                                    },
                                    {
                                        name: 'mode',
                                        xtype: 'combo',
                                        isLike: false,
                                        editable: false,
                                        store: Ext.create('Ext.data.Store', {
                                            fields: ['name', 'value'],
                                            data: [
                                                {name: '正式', value: 'RELEASE'},
                                                {name: '测试', value: 'TEST'}
                                            ]
                                        }),
                                        displayField: 'name',
                                        valueField: 'value',
                                        queryMode: 'local',
                                        fieldLabel: i18n.getKey('productMode'),
                                        itemId: 'mode'
                                    },
                                    {
                                        name: 'mainCategory',
                                        xtype: 'productcategorycombo',
                                        fieldLabel: i18n.getKey('maincategory'),
                                        itemId: 'mainCategory',
                                        isLike: false,
                                        multiselect: true,
                                        isMain: true
                                    },
                                    {
                                        name: 'subCategories',
                                        xtype: 'productcategorycombo',
                                        fieldLabel: i18n.getKey('subCategories'),
                                        isLike: false,
                                        itemId: 'subCategories',
                                        multiselect: true,
                                        isMain: false
                                    }
                                ]
                            }
                        },
                        gridConfig: {
                            autoScroll: true,
                            viewConfig: {
                                enableTextSelection: true
                            },
                            store: localStore,
                            bbar: {//底端的分页栏
                                xtype: 'pagingtoolbar',
                                store: localStore,
                                displayInfo: true, // 是否 ? 示， 分 ? 信息
                            },
                            columns: [
                                {
                                    text: i18n.getKey('id'),
                                    width: 120,
                                    dataIndex: 'id',
                                    itemId: 'id',
                                },
                                {
                                    text: i18n.getKey('type'),
                                    dataIndex: 'type',
                                    width: 150,
                                    itemId: 'type',
                                    sortable: false
                                },
                                {
                                    text: i18n.getKey('name'),
                                    dataIndex: 'name',
                                    width: 250,
                                    itemId: 'name'
                                },
                                {
                                    text: i18n.getKey('sku'),
                                    dataIndex: 'sku',
                                    autoSizeColumn: false,
                                    xtype: 'gridcolumn',
                                    itemId: 'sku',
                                    flex: 1,
                                    sortable: false,
                                    renderer: function (value, metadata) {
                                        metadata.tdAttr = 'data-qtip="' + value + '"';
                                        return value;
                                    }
                                }
                            ]
                        },
                    }],
                diySetValue: function (data) {
                    var me = this;
                    var item = me.items.items[0];
                    var scopeId = me.ownerCt.ownerCt.rawData._id;
                    var url = adminPath + 'api/productsuittrees/PRODUCT_SUIT_SCOPE/' + scopeId + '/Items'
                    JSAjaxRequest(url, 'GET', true, null, null, function (require, success, response) {
                        if (success) {
                            var responseText = Ext.JSON.decode(response.responseText);
                            item.diySetValue(responseText.data);
                        }
                    })
                },
                diyGetValue: function () {
                    var me = this;
                    var item = me.items.items[0];
                    return item.diyGetValue();
                },
            }
        ];
        me.callParent(arguments);
    }
})