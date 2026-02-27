/**
 * @Description:
 * @author nan
 * @date 2022/4/28
 */
Ext.Loader.syncRequire([
    'CGP.product.store.ProductStore',
    'CGP.cmsconfig.store.productAttributeStore',
    'CGP.common.field.ProductGridCombo',
    'CGP.cmsconfig.config.Config'
])
Ext.define('CGP.cmsconfig.view.BaseInfo', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.cmsbaseinfo',
    defaults: {
        width: 450,
        margin: '5 25 5 25'
    },
    itemId: 'baseInfo',
    title: i18n.getKey('baseInfo'),
    getProductId: function () {
        var me = this;
        var productField = me.getComponent('product');
        var productId = productField.getSubmitValue()[0];
        return productId;
    },
    initComponent: function () {
        var me = this;
        var type = JSGetQueryString('type');
        var cmsStore = Ext.create('CGP.cmspages.store.CMSPageStore', {
            autoLoad: false,
        });
        me.title = i18n.getKey('description');
        me.items = [
            {
                xtype: 'textfield',
                itemId: '_id',
                name: '_id',
                hidden: true,
                allowBlank: true,
                fieldLabel: i18n.getKey('_id')
            },
            {
                xtype: 'hiddenfield',
                itemId: 'configVersion',
                name: 'configVersion',
                allowBlank: true,
                fieldLabel: i18n.getKey('configVersion')
            },
            {
                xtype: 'textfield',
                itemId: 'clazz',
                name: 'clazz',
                hidden: true,
                value: CGP.cmsconfig.config.Config.clazz[type],
                allowBlank: true,
                fieldLabel: i18n.getKey('clazz')
            },
            {
                xtype: 'textarea',
                itemId: 'pageName',
                height: 80,
                name: 'pageName',
                allowBlank: false,
                vtype: 'diyUrl',
                fieldLabel: i18n.getKey('html') + i18n.getKey('pageName'),
                tipInfo: `{}|^[]\`~%#<>空格等字符使用的时候要谨慎，\n需要转义或者特殊处理,现在不允许输入空格字符`,
                validator: function (value) {
                    var result = true;
                    //再校验其他的，
                    // detail 后缀必须为.ejs 或者.html
                    // 分类页不做限制
                    var type = JSGetQueryString('type');
                    if (type == 'ProductDetail' || type == 'NormalPage') {
                        if (/\.\b(html|ejs)\b$/.test(value) == false) {
                            result = '详情页该字段必须以.html或.ejs结尾';
                        }
                    }
                    console.log('xxxxxxxxxxxxxxxx');
                    return result;
                },
                /* validateValue: function (value) {
                     var me = this,
                         errors = me.getErrors(value),
                         isValid = Ext.isEmpty(errors);
                     if (!me.preventMark) {
                         if (isValid) {
                             me.clearInvalid();
                         } else {
                             me.markInvalid(errors);
                         }
                     }
                     return isValid;
                 },*/
                diyGetValue: function () {
                    var me = this;
                    //去除所有空字符串
                    return me.getValue().replace(/\s*/g, "")
                }
            },
            {
                xtype: 'textarea',
                itemId: 'pageTitle',
                name: 'pageTitle',
                allowBlank: false,
                height: 80,
                fieldLabel: i18n.getKey('pageTitle'),

            },
            {
                name: 'cmsPageId',
                itemId: 'cmsPageId',
                xtype: 'gridcombo',
                fieldLabel: i18n.getKey('CMSPages'),
                allowBlank: false,
                editable: false,
                haveReset: true,
                autoScroll: true,
                multiSelect: false, //复选择器
                matchFieldWidth: false,
                displayField: 'name',
                valueField: '_id',
                store: cmsStore,
                filterCfg: {
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    defaults: {
                        isLike: false,
                        width: 200,
                        labelWidth: 60
                    },
                    items: [
                        {
                            name: '_id',
                            itemId: '_id',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('id')
                        },
                        {
                            name: 'name',
                            itemId: 'name',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('name')
                        },
                        {
                            name: 'cmsType',
                            itemId: 'cmsType',
                            xtype: 'combo',
                            editable: false,
                            displayField: 'key',
                            valueField: 'value',
                            value: CGP.cmsconfig.config.Config.cmsType[type],
                            hidden: true,
                            fieldLabel: i18n.getKey('cmsType'),
                            store: {
                                xtype: 'store',
                                fields: ['key', 'value'],
                                data: [
                                    {
                                        'key': '普通页',
                                        'value': 'Normal'
                                    },
                                    {
                                        'key': '产品详情',
                                        'value': 'ProductDetail'
                                    },
                                    {
                                        'key': '产品类目',
                                        'value': 'ProductCategory'
                                    }
                                ]
                            }
                        },
                        {
                            name: 'status',
                            xtype: 'combo',
                            editable: false,
                            fieldLabel: i18n.getKey('status'),
                            itemId: 'status',
                            displayField: 'key',
                            valueField: 'value',
                            store: {
                                xtype: 'store',
                                fields: ['key', 'value'],
                                data: [
                                    {
                                        key: '正式', value: 3
                                    },
                                    {
                                        key: '草稿', value: 1
                                    }
                                ]
                            }
                        }
                    ]
                },
                valueType: 'id',
                gridCfg: {
                    store: cmsStore,
                    height: 400,
                    width: 720,
                    columns: [
                        {
                            xtype: 'rownumberer',
                            tdCls: 'vertical-middle',
                        },
                        {
                            text: i18n.getKey('id'),
                            width: 90,
                            dataIndex: '_id'
                        },
                        {
                            text: i18n.getKey('name'),
                            width: 120,
                            dataIndex: 'name'
                        },
                        {
                            text: i18n.getKey('type'),
                            flex: 1,
                            dataIndex: 'cmsType',
                            renderer: function (value, matadata, record) {
                                if (value == 'ProductDetail') {
                                    return '产品详情'
                                } else if (value == 'ProductCategory') {
                                    return '产品类目'
                                }
                            }
                        },
                        {
                            text: i18n.getKey('status'),
                            flex: 1,
                            dataIndex: 'status',
                            renderer: function (value) {
                                if (value == 3) {
                                    return '正式';
                                } else if (value == 1) {
                                    return '草稿';
                                }
                            }
                        },
                        {
                            xtype: 'imagecolumn',
                            tdCls: 'vertical-middle',
                            width: 130,
                            dataIndex: 'staticPreviewFile',
                            text: i18n.getKey('staticPreviewFile'),
                            //订单的缩略图特殊位置
                            buildUrl: function (value, metadata, record) {
                                if (value) {
                                    var imageUrl = value;
                                    if (imageUrl.indexOf('.pdf') != -1) {
                                        imageUrl += '?format=png';
                                    }
                                    imageUrl = imageServer + imageUrl;
                                    return imageUrl;
                                }
                            },
                            //订单的缩略图特殊位置
                            buildPreUrl: function (value, metadata, record) {
                                if (value) {
                                    var imageUrl = value;
                                    if (imageUrl.indexOf('.pdf') != -1) {
                                        imageUrl += '?format=png';
                                    }
                                    imageUrl = imageServer + imageUrl;
                                    return imageUrl;
                                }
                            },
                            buildTitle: function (value, metadata, record) {
                                if (value) {
                                    var imageUrl = value;
                                    if (imageUrl.indexOf('.pdf') != -1) {
                                        imageUrl += '?format=png';
                                    }
                                    return `${i18n.getKey('check')} < ${imageUrl} > 预览图`;
                                }
                            }
                        },
                    ],
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: cmsStore,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyText: i18n.getKey('noDat')
                    }
                },
                gotoConfigHandler: function (event) {
                    var me = this;
                    var cmsPageId = this.getSubmitValue()[0];
                    if (cmsPageId) {
                        JSOpen({
                            id: 'cmspagespage',
                            url: path + 'partials/cmspages/main.html?_id=' + cmsPageId,
                            title: i18n.getKey('CMSPages'),
                            refresh: true
                        });
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    me.setInitialValue([data]);
                },
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var form = field.ownerCt;
                        var tab = form.ownerCt;
                        if (newValue) {
                            var obj = field.getValue();
                            var cmsPageId = this.getSubmitValue()[0];
                            var cmsData = obj[cmsPageId];
                            tab.imageSizeLimits = cmsData?.imageSizeLimits || [];
                        }
                    }
                }
            },
            {
                xtype: 'combo',
                fieldLabel: i18n.getKey('status'),
                allowBlank: false,
                editable: false,
                name: 'status',
                itemId: 'status',
                displayField: 'key',
                valueField: 'value',
                tipInfo: '类目发布时,该配置状态为草稿的不会被发布',
                store: {
                    xtype: 'store',
                    fields: ['key', 'value'],
                    data: [
                        {
                            'key': '正式',
                            'value': 3
                        },
                        {
                            'key': '草稿',
                            'value': 1
                        }
                    ]
                }
            }
        ];
        if (type == 'ProductDetail') {
            me.items.unshift({
                name: 'product',
                xtype: 'productgridcombo',
                itemId: 'product',
                fieldLabel: i18n.getKey('product'),
                allowBlank: false,
                editable: false,
                productType: null,
                displayField: 'name',
                haveReset: true,
                diySetValue: function (data) {
                    var me = this;
                    var tab = me.ownerCt;
                    tab.productId = data.id;
                    me.initId = data.id;
                    me.setInitialValue([data.id]);
                    me.setReadOnly(true);
                    me.setFieldStyle('background-color: silver');
                },
                diyGetValue: function () {
                    var me = this;
                    var data = me.getArrayValue();
                    return {
                        id: data.id,
                        clazz: data.clazz,
                        type: data.type.toLowerCase()
                    };
                },
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var form = field.ownerCt;
                        var tab = form.ownerCt;
                        var productField = form.getComponent('product');
                        var productId = field.getSubmitValue()[0];
                        tab.productId = productId;
                        if (productField.isValid()) {
                            tab.items.items.map(function (item) {
                                if (item.itemId != 'baseInfo' || item.itemId != 'seoConfig') {
                                    item.setDisabled(false);
                                }
                            })
                            var newId = Object.keys(newValue)[0];
                            var oldId = Object.keys(oldValue || {})[0];
                            var productInfo = newValue[newId];
                            if (newId != oldId) {
                                //加载profile
                                var configurableProductId = null;
                                if (productInfo.type == "SKU" && productInfo.configurableProductId) {
                                    configurableProductId = productInfo.configurableProductId;
                                }
                                tab.publishProfilesStore.proxy.extraParams = {
                                    filter: Ext.JSON.encode([{
                                        name: 'productId',
                                        type: 'number',
                                        value: Number(configurableProductId || productId)
                                    }])
                                };
                                tab.publishProfilesStore.load();
                                var productAttributeStore = tab.productAttributeStore;
                                tab.publishProfilesStore.load({
                                    callback: function () {
                                        var publishProfilesStore = this;
                                        var profiles = [];
                                        if (tab.data && tab.data.publishProfiles) {
                                            tab.data.publishProfiles.map(function (item) {
                                                profiles.push(item._id);
                                            });
                                        }
                                        var data = tab.buildAttributeStoreData(publishProfilesStore, productAttributeStore, profiles);
                                        productAttributeStore.proxy.data = data;
                                        productAttributeStore.load();
                                    }
                                });
                                tab.attributeVersionStore.proxy.extraParams = {
                                    filter: Ext.JSON.encode([{
                                        "name": "product._id",
                                        "value": productId,
                                        "type": "number"
                                    }, {
                                        "name": "status",
                                        "value": "(TEST|RELEASE)",
                                        "type": "string"
                                    }])
                                };
                                tab.attributeVersionStore.load();
                                if (field.initId != newId) {
                                    var pageName = form.getComponent('pageName');
                                    var pageTitle = form.getComponent('pageTitle');
                                    var productName = field.getDisplayValue();
                                    // 去掉转义字符
                                    productName = productName.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
                                    // 去掉特殊字符
                                    productName = productName.replace(/[\@\#\$\%\^\&\*\{\}\:\"\L\<\>\?]/, '');
                                    //除去空格用-替代,全小写,加上html
                                    productName = productName.replace(/\s+/g, '-');
                                    productName = productName.toLowerCase();
                                    pageName.setValue(productName + '-' + productId + '.html');
                                    pageTitle.setValue(productName);
                                }
                            }
                        } else {
                            tab.items.items.map(function (item) {
                                if (item.itemId != 'baseInfo') {
                                    item.setDisabled(true);
                                }
                            })
                        }
                    },
                    afterrender: function () {
                        var me = this;
                        //指定产品添加cmsConfig
                        var productId = JSGetQueryString('productId');
                        if (productId) {
                            me.setInitialValue([productId]);
                            me.setReadOnly(true);
                            me.setFieldStyle('background-color: silver');
                        }
                    }
                }
            });
        } else if (type == 'ProductCategory') {
            me.items.unshift({
                name: 'category',
                xtype: 'uxtreecombohaspaging',
                isMain: false,
                websiteSelectorEditable: false,
                defaultWebsite: 11,
                fieldLabel: i18n.getKey('catalog'),
                itemId: 'category',
                displayField: 'displayName',
                valueField: 'id',
                infoUrl: adminPath + 'api/productCategories/{id}/detail',
                store: Ext.create('CGP.common.store.ProductCategory', {
                    proxy: {
                        type: 'treerest',
                        url: adminPath + 'api/productCategories/{id}',
                        headers: {
                            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                        },
                        extraParams: {
                            website: 11,//默认38
                            isMain: false,
                            filter: Ext.JSON.encode([
                                {
                                    "name": "showAsProductCatalog",
                                    "value": true,
                                    "type": "boolean"
                                }, {
                                    name: 'publishStatus',
                                    type: 'number',
                                    value: 1
                                }]),
                            limit: 25
                        },
                        reader: {
                            type: 'json',
                            root: 'data'
                        }
                    },
                    params: {}
                }),
                allowBlank: false,
                selectChildren: false,
                canSelectFolders: true,
                editable: false,
                multiselect: false,
                hideTopBar: true,
                isHiddenCheckSelected: true,
                treePanelConfig: {
                    width: 550,
                    tbar: {
                        layout: 'column',
                        defaults: {
                            margin: '5 5',
                            labelWidth: 50,
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: '编号',
                                itemId: 'productCategorySearch',
                            },
                            {
                                xtype: 'combo',
                                value: 1,
                                itemId: 'statusSearch',
                                displayField: 'name',
                                valueField: 'value',
                                fieldLabel: '状态',
                                editable: false,
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['name', 'value'],
                                    data: [
                                        {name: '启用', value: 1},
                                        {name: '弃用', value: 2},
                                        {
                                            value: '',
                                            name: i18n.getKey('allType')
                                        }]
                                }),
                            },
                            //是否作为营销类目 false为营销类目，true为普通产品子类目
                            {
                                xtype: 'combo',
                                fieldLabel: i18n.getKey('type'),
                                name: 'showAsProductCatalog',
                                itemId: 'showAsProductCatalog',
                                displayField: 'display',
                                valueField: 'value',
                                value: true,
                                editable: false,
                                store: {
                                    xtype: 'store',
                                    fields: [{
                                        name: 'value',
                                        type: 'boolean'
                                    }, {
                                        name: 'display',
                                        type: 'string'
                                    }],
                                    data: [
                                        {
                                            value: true,
                                            display: '产品类目'
                                        },
                                        {
                                            value: false,
                                            display: '营销类目'
                                        }
                                    ],
                                },
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('查询'),
                                iconCls: 'icon_query',
                                handler: function () {
                                    var me = this;
                                    var toolbar = me.ownerCt;
                                    var treePanel = toolbar.ownerCt;
                                    var category = toolbar.getComponent('productCategorySearch');
                                    var statusSearch = toolbar.getComponent('statusSearch');
                                    var showAsProductCatalog = toolbar.getComponent('showAsProductCatalog');
                                    var categoryId = category.getValue();
                                    var statusValue = statusSearch.getValue();
                                    var showAsProductCatalogValue = showAsProductCatalog.getValue();
                                    var store = treePanel.store;
                                    var oldParams = store.params;
                                    var arr = [];
                                    if (categoryId) {
                                        if (categoryId) {
                                            arr.push({
                                                name: 'id',
                                                type: 'number',
                                                value: categoryId
                                            });
                                        }
                                    }
                                    if (statusValue) {
                                        arr.push({
                                            name: 'publishStatus',
                                            type: 'number',
                                            value: statusValue
                                        });
                                    } else {
                                        arr.push({
                                            name: 'publishStatus',
                                            type: 'number',
                                            value: ''
                                        });
                                    }
                                    arr.push({
                                        name: 'showAsProductCatalog',
                                        type: 'boolean',
                                        value: showAsProductCatalogValue
                                    });
                                    var params = {
                                        params: Ext.Object.merge(Ext.clone(store.params), {
                                            filter: Ext.JSON.encode(arr),
                                            page: 1//过滤出来的第一页，如果不是第一页，数据没法返回
                                        })
                                    };
                                    store.clearOnLoad = true;
                                    store.load(params);
                                    store.clearOnLoad = false;
                                    delete oldParams.filter;
                                    store.params = oldParams;
                                }
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('清除'),
                                iconCls: 'icon_clear',
                                handler: function () {
                                    var me = this;
                                    var toolbar = me.ownerCt;
                                    var treePanel = toolbar.ownerCt;
                                    var category = toolbar.getComponent('productCategorySearch');
                                    var statusSearch = toolbar.getComponent('statusSearch');
                                    var showAsProductCatalog = toolbar.getComponent('showAsProductCatalog');
                                    var store = treePanel.store;
                                    category.reset();
                                    statusSearch.reset();
                                    showAsProductCatalog.reset();
                                    store.load();
                                }
                            }
                        ]
                    }
                },
                defaultColumnConfig: {
                    text: i18n.getKey('name'),
                    renderer: function (value, metadata, record) {
                        return value + ' (<font color="green">' + record.getId() + '</font>)';
                    }
                },
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var form = field.ownerCt;
                        var tab = form.ownerCt;
                        if (field.isValid()) {
                            tab.items.items.map(function (item) {
                                if (item.itemId != 'baseInfo' || item.itemId != 'seoConfig') {
                                    item.setDisabled(false);
                                }
                            })
                            if (newValue != oldValue) {
                                //加载profile
                                var categoryId = newValue;
                                tab.categoryProductInfoStore.proxy.url = adminPath + 'api/product-of-catalog/subProductCategories/' + (categoryId) + '/products';
                                tab.categoryProductInfoStore.load();
                            }
                        } else {
                            tab.items.items.map(function (item) {
                                if (item.itemId != 'baseInfo') {
                                    item.setDisabled(true);
                                }
                            })
                        }
                        /***
                         * 去掉字符串中的特殊字符
                         */
                        if (field.initId != newValue) {
                            var pageName = form.getComponent('pageName');
                            var pageTitle = form.getComponent('pageTitle');
                            var productName = field.getRawValue();
                            productName = productName.slice(0, productName.indexOf('('));
                            productName = productName.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
                            // 去掉特殊字符
                            productName = productName.replace(/[\@\#\$\%\^\&\*\{\}\:\"\L\<\>\?]/, '');
                            //除去空格用-替代,全小写,加上html
                            productName = productName.replace(/\s+/g, '-');
                            pageName.setValue(productName + '.html');
                            productName = productName.toLowerCase();
                            pageTitle.setValue(productName);
                        }
                    }
                },
                gotoConfigHandler: function (value, metadata, record) {
                    //跳转到类目
                    var showAsProductCatalog = this.selectedRecords[0].raw.showAsProductCatalog;
                    var catalogId = this.selectedRecords[0].raw.id;
                    if (showAsProductCatalog) {
                        JSOpen({
                            id: 'productCatalog',
                            url: path + 'partials/productcatalog/main.html?id=' + catalogId,
                            title: i18n.getKey('productCatalog'),
                            refresh: true
                        });
                    } else {
                        JSOpen({
                            id: 'saleProductCatalog',
                            url: path + 'partials/saleproductcatalog/main.html?id=' + catalogId,
                            title: i18n.getKey('saleProductCatalog'),
                            refresh: true
                        });
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    me.initId = data.id;
                    me.setInitialValue([data.id]);
                },
                diyGetValue: function () {
                    var me = this;
                    return {
                        id: Number(me.getValue()),
                        clazz: 'com.qpp.cgp.domain.product.category.SubProductCategory'
                    }
                },
            });
        }
        me.callParent(arguments);
    }
}, function () {
    Ext.apply(Ext.form.VTypes, {
        diyUrl: function (value) {//验证方法名
            return !(/[<>^`{|}]/.test(value));
        },
        diyUrlText: '含有以下非法字符："<>^`{|}'
    });

})
