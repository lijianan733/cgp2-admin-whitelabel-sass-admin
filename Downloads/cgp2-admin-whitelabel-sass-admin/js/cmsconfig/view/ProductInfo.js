/**
 * @Description:注意要在diySetValue中添加新的对应数据，保障为渲染时的保存数据完整
 * @author nan
 * @date 2022/4/28
 */
Ext.Loader.syncRequire([
    'CGP.product.store.ProductStore',
    'CGP.saletag.store.SaleTagStore',
    'CGP.saletag.model.SaleTagModel',
    'CGP.cmsconfig.view.DiyHtmlEditor'
])
Ext.define('CGP.cmsconfig.view.ProductInfo', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.productinfo',
    title: i18n.getKey('product') + i18n.getKey('info'),
    itemId: 'productinfo',
    autoScroll: true,
    isValidForItems: true,
    publishProfilesStore: null,
    attributeVersionStore: null,
    productAttributeStore: null,
    defaults: {
        margin: '15 50',
        width: 1100,
    },
    data: null,
    productImages: [],
    groupCodeStoreData: [],
    newProductAttributeStoreData: [],
    diySetValue: function (data) {
        if (data) {
            var me = this;
            me.productImages = data?.productImages;
            me.data = {
                publishProfiles: data.publishProfiles,
                properties: data.properties,
                relatedProductIds: data.relatedProductIds,
                shortDesc: data.shortDesc,
                globalPriority: data.globalPriority,
                defaultImageInCatalog: data.defaultImageInCatalog,
                specifications: data.specifications,
                productDesc: data.productDesc,
                saleTags: data.saleTags,
                hoverImageInCatalog: data.hoverImageInCatalog,
                groups: data.groups
            };
            //有配置属性版本,多以下字段
            if (Ext.isEmpty(data.versionedProductAttributeId) == false) {
                me.data.getAttributeVersionType = data.versionedProductAttributeId != 0 ? 'specific' : 'latest';
                me.data.versionedProductAttributeId = data.versionedProductAttributeId;
                //如果是空数组就不传数据
                me.data.publishProfileCodes = data.publishProfileCodes.length > 0 ? data.publishProfileCodes : null;
            } else {
                me.data.getAttributeVersionType = 'notUse';
                me.data.versionedProductAttributeId = null
                me.data.publishProfileCodes = null
            }
            me.setValue(me.data);
        }
    },
    diyGetValue: function () {
        var me = this;
        if (me.rendered) {
            return me.getValue();
        } else {
            return me.data;
        }
    },
    loadData: function () {
        var me = this;
        var publishProfiles = me.getComponent('publishProfiles');
        var selector = [];
        var publishProfilesData = me.data?.publishProfiles || [];
        me.publishProfilesStore.data.items.map(function (item) {
            var profileId = item.getId();
            selector.push({
                boxLabel: item.get('name') + (item.get('code') ? '' : '<font color="red">(缺失代码字段)</font>'),
                name: 'value',
                inputValue: profileId,
                checked: false,
            });
        });
        var profiles = [];
        if (publishProfilesData.length == 0 && selector.length > 0) {//默认选择第一个profile
            profiles.push(selector[0].inputValue);
        } else if (publishProfilesData.length > 0 && selector.length > 0) {//使用本来有的数据
            publishProfilesData.map(function (item) {
                profiles.push(item._id);
            })
        }
        if (selector.length > 0) {
            publishProfiles.removeAll();
            publishProfiles.add(selector);
            publishProfiles.show();
            publishProfiles.setValue({
                value: profiles
            });
        } else {
            publishProfiles.hide();
        }
    },
    /**
     * 构建属性store需要的数据
     */
    initComponent: function () {
        Ext.apply(Ext.form.field.VTypes, {
            filePath: function (v) {
                return !/^[/]$/.test(v);
            },
            filePathText: '路径不允许只输入"/"',
            filePathMask: /[\w/]$/i     //限制输入
        });
        var me = this,
            productAttributeStoreMemory = {
                xtype: 'store',
                fields: [
                    {
                        name: 'attribute',
                        type: 'object'
                    },
                    {
                        name: 'componentType',
                        type: 'string'
                    },
                    {
                        name: 'guideName',
                        type: 'string'
                    },
                    {
                        name: 'guideUrl',
                        type: 'string'
                    },
                    {
                        name: 'shortDesc',
                        type: 'string'
                    },
                    {
                        name: 'nickName',
                        type: 'string'
                    },
                    {
                        name: 'options',
                        type: 'array'
                    }
                ],
                proxy: {
                    type: 'memory'
                },
                autoLoad: true,
                data: []
            },
            relatedProductsStore = {
                xtype: 'store',
                fields: [
                    {
                        name: 'id',
                        type: 'string'
                    },
                    {
                        name: 'name',
                        type: 'string'
                    },
                    {
                        name: 'type',
                        type: 'string'
                    },
                    {
                        name: 'sku',
                        type: 'string'
                    },
                ],
                proxy: {
                    type: 'pagingmemory'
                },
                data: []
            },
            productAttributeStore = me.productAttributeStore,
            newProductAttributeStoreData = [],
            saleTagStore = Ext.create('Ext.data.Store', {
                model: 'CGP.saletag.model.SaleTagModel',
                data: [],
                proxy: {
                    type: 'pagingmemory'
                }
            }),
            attributeVersionStore = me.attributeVersionStore,
            controller = Ext.create('CGP.cmsconfig.controller.Controller'),
            optionsStore = Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: 'optionId',
                        type: 'string'
                    },
                    {
                        name: 'displayName',
                        type: 'string'
                    },
                    {
                        name: 'imageUrl',
                        type: 'string'
                    },
                    {
                        name: 'shortDesc',
                        type: 'string'
                    },
                    {
                        name: 'sortOrder',
                        type: 'number'
                    }
                ],
                proxy: {
                    type: 'memory'
                },
                autoLoad: true,
                data: []
            }),
            groupStore = Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: 'groupCode',
                        type: 'string'
                    },
                    {
                        name: 'config',
                        type: 'object'
                    },
                ],
                pageSize: 1000,
                proxy: {
                    type: 'pagingmemory'
                },
                data: []
            }),
            configStore = Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: '_id',
                        type: 'number'
                    },
                    {
                        name: 'clazz',
                        type: 'string'
                    },
                    {
                        name: 'description',
                        type: 'string'
                    },
                    {
                        name: 'border',
                        type: 'number'
                    },
                    {
                        name: 'attributeSchemaVersion',
                        type: 'string'
                    },
                    {
                        name: 'orientation',
                        type: 'string'
                    },
                    {
                        name: 'template',
                        type: 'object'
                    },
                ],
                /* proxy: {
                     type: 'pagingmemory'
                 },
                 data: [
                     {
                         "_id": 277620997,
                         "clazz": "com.qpp.cgp.domain.cms.Panel",
                         "border": 1,
                         "attributeSchemaVersion": "v1",
                         "orientation": "Vertical"
                     }
                 ]*/
                pageSize: 25,
                proxy: {
                    type: 'uxrest',
                    url: adminPath + 'api/cms/product/group-configs',
                    reader: {
                        type: 'json',
                        root: 'data.content'
                    }
                },
                autoLoad: true,
                constructor: function (config) {
                    var me = this;
                    if (config.params) {
                        me.proxy.extraParams = config.params;
                    }
                    me.callParent(arguments);
                }
            }),
            attributeOptionsStore = Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: 'id',
                        type: 'number'
                    },
                    {
                        name: 'name',
                        type: 'string'
                    },
                    {
                        name: 'value',
                        type: 'string'
                    },
                    {
                        name: 'displayValue',
                        type: 'string'
                    },
                    {
                        name: 'sortOrder',
                        type: 'number'
                    }
                ],
                sorters: [{
                    property: 'sortOrder',
                    direction: 'ASC'
                }],
                pageSize: 10000,
                proxy: {
                    type: 'pagingmemory'
                },
                autoLoad: true,
                data: []
            }),
            groupCodeStore = Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: '_id',
                        type: 'string'
                    },
                    {
                        name: 'displayName',
                        type: 'string'
                    },
                    {
                        name: 'sort',
                        type: 'number'
                    },
                    {
                        name: 'code',
                        type: 'string'
                    },
                    {
                        name: 'name',
                        type: 'string'
                    },
                ],
                pageSize: 10000,
                proxy: {
                    type: 'pagingmemory'
                },
                sorters: [
                    {
                        property: 'sort',
                        direction: 'ASC'
                    }
                ],
                autoLoad: true,
                data: []
            });

        me.items = [
            {
                xtype: 'radiogroup',
                fieldLabel: i18n.getKey('获取属性版本方式'),
                name: 'getAttributeVersionType',
                itemId: 'getAttributeVersionType',
                width: 600,
                items: [
                    {
                        boxLabel: '<font color="red">不使用属性版本</font>',
                        name: 'type',
                        inputValue: 'notUse'
                    },
                    {
                        boxLabel: '<font color="green">指定属性版本</font>',
                        name: 'type',
                        inputValue: 'specific',
                        checked: true,
                    },
                    {
                        boxLabel: '<font color="blue">自动取最新属性版本</font>',
                        name: 'type',
                        inputValue: 'latest'
                    }
                ],
                tipInfo: '指定属性版本的产品profile必须配置代码字段',
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var form = field.ownerCt;
                        var versionedProductAttributeId = form.getComponent('versionedProductAttributeId');
                        if (newValue.type == 'specific') {
                            versionedProductAttributeId.reset();
                            versionedProductAttributeId.show();
                            versionedProductAttributeId.setAllowBlank(false);
                        } else if (newValue.type == 'notUse') {
                            JSSetLoading(true);
                            versionedProductAttributeId.setValue(null);
                            versionedProductAttributeId.hide();
                            versionedProductAttributeId.setAllowBlank(true);
                            var productId = form.ownerCt.productId;
                            form.publishProfilesStore.proxy.extraParams = {
                                filter: Ext.JSON.encode([{
                                    "name": "productId",
                                    "value": productId,
                                    "type": "number"
                                }])
                            };
                            //更新profilestore
                            form.publishProfilesStore.load({
                                callback: function () {
                                    form.loadData();
                                    //如果是编辑，状态，且data.publishProfileCodes有数据
                                    JSSetLoading(false);
                                    if (form?.data?.publishProfileCodes) {
                                        var publishProfiles = form.getComponent('publishProfiles');
                                        var ids = [];
                                        form.publishProfilesStore.each(function (item) {
                                            if (Ext.Array.contains(form.data.publishProfileCodes, item.get('code'))) {
                                                ids.push(item.get('_id'))
                                            }
                                        });
                                        publishProfiles.diySetValue(ids);
                                    }
                                }
                            });
                            JSSetLoading(false);

                        } else if (newValue.type == 'latest') {
                            var store = versionedProductAttributeId.store;
                            //拿最新的非草稿,作为当前的配置所对应的属性版本
                            var latestRecord = null;
                            var count = 0;
                            versionedProductAttributeId.setAllowBlank(true);
                            versionedProductAttributeId.store.each(function (item) {
                                if (item.get('status') != 'DRAFT') {
                                    var version = item.get('version');
                                    if (version > count) {
                                        count = version;
                                        latestRecord = item;
                                    }
                                }
                            });
                            if (latestRecord) {
                                var id = latestRecord.get('_id');
                                var data = latestRecord.getData();
                                versionedProductAttributeId.setValue({_id: 0});
                                versionedProductAttributeId.fireEvent('change', versionedProductAttributeId, {
                                    [id]: data
                                }, null);
                            } else {
                                //如果选最新版本，但是又没可用的属性版本，提示错误
                                Ext.Msg.alert('提示', '当前无可用的属性版本!');
                            }
                            versionedProductAttributeId.hide();
                        }
                    }
                }
            },
            {
                xtype: 'hiddenfield',
                hidden: true,
                name: 'publishProfileCodes',
                itemId: 'publishProfileCodes',
                allowBlank: true,
                data: null,
                diySetValue: function (data) {
                    var me = this;
                    me.publishProfileCodes = data;
                    me.data = data;
                },
                diyGetValue: function () {
                    var _me = this;
                    me.publishProfileCodes = _me.data;
                    return _me.data;
                }
            },
            {
                xtype: 'gridcombo',
                fieldLabel: i18n.getKey('属性版本'),
                name: 'versionedProductAttributeId',
                itemId: 'versionedProductAttributeId',
                allowDecimals: false,
                width: 350,
                minValue: 0,
                editable: false,
                matchFieldWidth: false,
                displayField: '_id',
                valueField: '_id',
                allowBlank: true,
                haveReset: true,
                tipInfo: '只有非草稿状态的属性版本可供选择',
                valueType: 'id',//recordData,idReference,id为可选的值类型
                store: attributeVersionStore,
                gridCfg: {
                    store: attributeVersionStore,
                    maxHeight: 450,
                    width: 720,
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            width: 100,
                            dataIndex: '_id',
                        }, {
                            text: i18n.getKey('status'),
                            dataIndex: 'status',
                            width: 100,
                            renderer: function (value, metadata, record) {
                                //'DRAFT', 'TEST', 'RELEASE'
                                if (value == 'DRAFT') {
                                    return '<font color="orange" style="font-weight: bold">草稿</font>';
                                } else if (value == 'TEST') {
                                    return '<font color="red" style="font-weight: bold">测试</font>';
                                } else if (value == 'RELEASE') {
                                    return '<font color="green" style="font-weight: bold">上线</font>';
                                }
                            }
                        }, {
                            text: i18n.getKey('remark'),
                            dataIndex: 'remark',
                            width: 250,
                        }, {
                            text: i18n.getKey('version'),
                            dataIndex: 'version',
                            flex: 1,
                        },],
                    bbar: {
                        xtype: 'pagingtoolbar',
                        stoer: attributeVersionStore
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setValue({
                            _id: Number(data)
                        });
                    }
                },
                listeners: {
                    change: function (field, newValue, oldValue) {
                        if (!Ext.Object.isEmpty(newValue)) {
                            JSSetLoading(true);
                            var form = field.ownerCt;
                            var productId = form.ownerCt.productId;
                            var versionedAttributeId = Object.keys(newValue)[0];
                            form.publishProfilesStore.proxy.extraParams = {
                                filter: Ext.JSON.encode([
                                    {
                                        "name": "productId",
                                        "value": productId,
                                        "type": "number"
                                    }, {
                                        "value": versionedAttributeId,
                                        "type": "number",
                                        "name": "versionedAttribute._id"
                                    }])
                            };
                            //更新profilestore
                            form.publishProfilesStore.load({
                                callback: function () {
                                    form.loadData();
                                    //如果是编辑，状态，且data.publishProfileCodes有数据
                                    JSSetLoading(false);
                                    if (form?.data?.publishProfileCodes) {
                                        var publishProfiles = form.getComponent('publishProfiles');
                                        var ids = [];
                                        form.publishProfilesStore.each(function (item) {
                                            if (Ext.Array.contains(form.data.publishProfileCodes, item.get('code'))) {
                                                ids.push(item.get('_id'))
                                            }
                                        });
                                        publishProfiles.diySetValue(ids);
                                    }
                                }
                            });
                        }
                    }
                }
            },
            {
                xtype: 'radiogroup',
                fieldLabel: i18n.getKey('profile'),
                columns: 3,
                width: 800,
                name: 'publishProfiles',
                itemId: 'publishProfiles',
                vertical: true,
                items: [],
                allowBlank: true,
                diyGetValueId: function () {
                    var me = this;

                    return me.getValue().value;
                },
                diyGetValue: function () {
                    var me = this;
                    var data = me.getValue().value;
                    if (!Ext.isEmpty(data)) {
                        Ext.isArray(data) ? null : (data = [data]);
                        data = data.map(function (item) {
                            return {
                                _id: item,
                                clazz: 'com.qpp.cgp.domain.attributeconfig.AttributeProfile'
                            }
                        })
                        return data;
                    }
                },
                /**
                 * 新建状态不用理，编辑状态每次获取最新的属性版本的profile
                 * 特殊处理，有属性版本的时候，
                 * 设置值根据publishProfileCodes，
                 * 没属性版本用publishProfiles
                 * @param data
                 */
                diySetValue: function (data) {
                    var me = this;
                    var value = {value: []};
                    if (data) {
                        data.map(function (item) {
                            value.value.push(item._id);
                        })
                    }
                    me.setValue(value);
                },
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var me = this,
                            productInfo = me.ownerCt,
                            publishProfilesStore = productInfo.publishProfilesStore,
                            productAttributeStore = productInfo.productAttributeStore,
                            publishProfileCodes = productInfo.getComponent('publishProfileCodes'),
                            profiles = [];

                        if (newValue.value) {
                            if (Ext.isArray(newValue.value)) {
                                profiles = newValue.value;
                            } else {
                                profiles = [newValue.value];
                            }
                        } else {
                            profiles = [];
                        }

                        newProductAttributeStoreData = productInfo.ownerCt.buildAttributeStoreData(publishProfilesStore, productAttributeStore, profiles);

                        productAttributeStore.proxy.data = newProductAttributeStoreData;
                        productAttributeStore.load();

                        //把profile的code信息设置到publishProfileCodes
                        var codes = [];
                        profiles.map(function (item) {
                            var profile = productInfo.publishProfilesStore.findRecord('_id', item);
                            var code = profile.get('code');
                            if (code) {
                                codes.push(code);
                            }
                        });
                        publishProfileCodes.diySetValue(codes);
                    }
                }
            },
            {
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('index'),
                name: 'globalPriority',
                itemId: 'globalPriority',
                allowDecimals: false,
                width: 350,
                minValue: 0,
                tipInfo: '产品在所有类目下的优先级,如果修改,则会同步修改在所有类目中的优先级',
            },
            {
                xtype: 'fileuploadv2',
                name: 'defaultImageInCatalog',
                itemId: 'defaultImageInCatalog',
                fieldLabel: i18n.getKey('类目页产品图'),
                allowFileType: ['image/*'],
                width: 500,
                allowBlank: true,
                editable: false,
                isShowImage: true,        //是否显示预览图
                imageSize: 50,            //预览图大小 width and height 也控制输入框大小
                valueUrlType: 'object',   //完整路径 full, 部分路径 part, 文件信息 object
                UpFieldLabel: i18n.getKey('image'),
                filePathCfg: {
                    readOnly: false,
                },
                diyGetValue: function () {
                    var me = this;
                    var filePath = me.getComponent('filePath');
                    var fileName = filePath.getValue();
                    if (fileName) {
                        return me.rawData;
                    } else {
                        return null;
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.rawData = data;
                        me.setValue(data);
                    }
                },
                isValid: function () {
                    var me = this;
                    me.Errors = {};
                    var valid = true;
                    if (me.allowBlank == true || me.disabled == true) {
                        return valid;
                    } else {
                        valid = !Ext.isEmpty(me.rawData);
                        if (valid == false) {
                            var filePath = me.getComponent('filePath');
                            me.Errors[me.getFieldLabel()] = filePath.getErrors();
                        }
                        return valid;
                    }
                },
                extraButton: [
                    {
                        xtype: 'button',
                        margin: '0 0 5 5',
                        width: 60,
                        itemId: 'selProductImage',
                        text: i18n.getKey('选产品图'),
                        handler: function (btn) {
                            var fileuploadv2 = btn.ownerCt.ownerCt,
                                store = Ext.create('Ext.data.Store', {
                                    fields: [
                                        {
                                            name: 'small',
                                            type: 'object'
                                        },
                                        {
                                            name: 'large',
                                            type: 'object'
                                        },
                                        {
                                            name: 'title',
                                            type: 'string'
                                        },
                                        {
                                            name: 'alt',
                                            type: 'string'
                                        },
                                    ],
                                    pageSize: 10000,
                                    autoLoad: true,
                                    proxy: {
                                        type: 'memory'
                                    },
                                    data: me.productImages
                                });
                            controller.createSelProductImageWin(false, store, function (record) {
                                fileuploadv2.diySetValue(record.get('large'));
                            });
                        }
                    },
                ]

            },
            {
                xtype: 'fileuploadv2',
                name: 'hoverImageInCatalog',
                itemId: 'hoverImageInCatalog',
                fieldLabel: i18n.getKey('产品hover图'),
                allowFileType: ['image/*'],
                width: 500,
                allowBlank: true,
                editable: true,
                isShowImage: true,        //是否显示预览图
                imageSize: 50,            //预览图大小 width and height 也控制输入框大小
                valueUrlType: 'object',   //完整路径 full, 部分路径 part, 文件信息 object
                diyGetValue: function () {
                    var me = this;
                    var filePath = me.getComponent('filePath');
                    var fileName = filePath.getValue();
                    if (fileName) {
                        return me.rawData;
                    } else {
                        return null;
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.rawData = data;
                        me.setValue(data);
                    }
                },
                extraButton: [
                    {
                        xtype: 'button',
                        margin: '0 0 5 5',
                        width: 60,
                        itemId: 'selProductImage',
                        text: i18n.getKey('选产品图'),
                        handler: function (btn) {
                            var fileuploadv2 = btn.ownerCt.ownerCt,
                                store = Ext.create('Ext.data.Store', {
                                    fields: [
                                        {
                                            name: 'small',
                                            type: 'object'
                                        },
                                        {
                                            name: 'large',
                                            type: 'object'
                                        },
                                        {
                                            name: 'title',
                                            type: 'string'
                                        },
                                        {
                                            name: 'alt',
                                            type: 'string'
                                        },
                                    ],
                                    pageSize: 10000,
                                    autoLoad: true,
                                    proxy: {
                                        type: 'memory'
                                    },
                                    data: me.productImages
                                });
                            controller.createSelProductImageWin(false, store, function (record) {
                                fileuploadv2.diySetValue(record.get('large'));
                            });
                        }
                    },
                ]
            },

            {
                xtype: 'gridfieldhascomplementarydata',
                name: 'saleTags',
                itemId: 'saleTags',
                allowBlank: true,
                fieldLabel: i18n.getKey('销售标签'),
                autoScroll: true,
                maxHeight: 350,
                width: 550,
                dataWindowCfg: {
                    width: 500,
                    height: 350
                },
                searchGridCfg: {
                    gridCfg: {
                        editAction: false,
                        deleteAction: false,
                        storeCfg: {
                            clazz: 'CGP.saletag.store.SaleTagStore'
                        }
                    },
                    filterCfg: {
                        hidden: true,
                    }
                },
                gridConfig: {
                    autoScroll: true,
                    store: saleTagStore,
                    bbar: {//底端的分页栏
                        xtype: 'pagingtoolbar',
                        store: saleTagStore,
                    },
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            dataIndex: '_id',
                            itemId: '_id',
                        }, {
                            text: i18n.getKey('name'),
                            dataIndex: 'name',
                            itemId: 'name',
                            flex: 1,
                        }]
                },
            },
            {
                xtype: 'gridfieldwithcrudv2',
                name: 'groups',
                itemId: 'groups',
                fieldLabel: i18n.getKey('groups'),
                allowBlank: true,
                gridConfig: {
                    store: groupStore,
                    maxHeight: 300,
                    layout: 'fit',
                    columns: [
                        {
                            xtype: 'rownumberer',
                            tdCls: 'vertical-middle',
                        },
                        {
                            text: i18n.getKey('groupCode'),
                            dataIndex: 'groupCode',
                            width: 120,
                            renderer: function (value, metaData, record) {
                                metaData.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('config'),
                            dataIndex: 'config',
                            flex: 1,
                            renderer: function (value, metaData, record) {
                                var {_id, border, orientation, attributeSchemaVersion, template} = value,
                                    result = [
                                        {
                                            title: '_id',
                                            value: _id
                                        },
                                        {
                                            title: 'border',
                                            value: border
                                        },
                                        {
                                            title: 'orientation',
                                            value: orientation
                                        },
                                        {
                                            title: 'attributeSchemaVersion',
                                            value: attributeSchemaVersion
                                        },
                                        {
                                            title: 'templateCode',
                                            value: template?.code
                                        },
                                    ]

                                return JSCreateHTMLTable(result);
                            }
                        },
                    ]
                },
                winConfig: {
                    formConfig: {
                        defaults: {
                            msgTarget: 'none',
                            margin: '10 25',
                            width: 450,
                            labelWidth: 120,
                        },
                        items: [
                            {
                                xtype: 'gridcombo',
                                name: 'groupCode',
                                itemId: 'groupCode',
                                editable: false,
                                autoScroll: true,
                                allowBlank: false,
                                multiSelect: false,
                                matchFieldWidth: false,
                                fieldLabel: i18n.getKey('group代码'),
                                valueField: 'code',
                                displayField: 'code',
                                store: groupCodeStore,
                                filterCfg: {
                                    searchActionHandler: function (btn) { //重写本地查询
                                        var _me = this,
                                            form = _me.ownerCt.ownerCt,
                                            searchcontainer = form.ownerCt,
                                            store = searchcontainer.store,
                                            filterData = form.getQuery()

                                        if (filterData.length) {
                                            store.proxy.data = controller.getFilteredValues(filterData, me.groupCodeStoreData);
                                        } else {
                                            store.proxy.data = me.groupCodeStoreData;
                                        }
                                        store.load();
                                    },
                                    layout: {
                                        type: 'table',
                                        column: 3
                                    },
                                    defaults: {
                                        margin: '5 0 5 0',
                                        isLike: false,
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            hideTrigger: true,
                                            fieldLabel: i18n.getKey('id'),
                                            name: '_id',
                                            itemId: 'id'
                                        },
                                        {
                                            xtype: 'textfield',
                                            hideTrigger: true,
                                            fieldLabel: i18n.getKey('code'),
                                            name: 'code',
                                            itemId: 'code'
                                        },
                                        {
                                            xtype: 'textfield',
                                            hideTrigger: true,
                                            fieldLabel: i18n.getKey('name'),
                                            name: 'name',
                                            itemId: 'name'
                                        },
                                        {
                                            xtype: 'textfield',
                                            hideTrigger: true,
                                            fieldLabel: i18n.getKey('displayName'),
                                            name: 'displayName',
                                            itemId: 'displayName'
                                        },
                                    ]
                                },
                                diyGetValue: function () {
                                    var me = this,
                                        selectId = me.getSubmitValue()[0],
                                        selectData = me.getValue()[selectId];

                                    return selectData['code'];
                                },
                                diySetValue: function (data) {
                                    setTimeout(item => {
                                        if (data) {
                                            var me = this,
                                                storeData = groupCodeStore.proxy.data,
                                                filters = [
                                                    {
                                                        name: "code",
                                                        value: data,
                                                        type: "string",
                                                        operator: "exactMatch"
                                                    }
                                                ],
                                                result = JSGetFilteredValues(filters, storeData)[0];

                                            me.setValue(result);
                                        }
                                    }, 1000)
                                },
                                gridCfg: {
                                    store: groupCodeStore,
                                    height: 400,
                                    width: 900,
                                    autoScroll: true,
                                    columns: [
                                        {
                                            xtype: 'rownumberer',
                                            tdCls: 'vertical-middle',
                                            width: 60
                                        },
                                        {
                                            text: i18n.getKey('id'),
                                            dataIndex: '_id',
                                            width: 120
                                        },
                                        {
                                            text: i18n.getKey('code'),
                                            dataIndex: 'code',
                                            width: 200
                                        },
                                        {
                                            text: i18n.getKey('name'),
                                            dataIndex: 'name',
                                            flex: 1
                                        },
                                        {
                                            text: i18n.getKey('displayName'),
                                            dataIndex: 'displayName',
                                            flex: 1
                                        },
                                    ],
                                    bbar: {
                                        xtype: 'pagingtoolbar',
                                        store: groupCodeStore,
                                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                                        emptyMsg: i18n.getKey('noData')
                                    }
                                },
                            },
                            {
                                xtype: 'gridcombo',
                                name: 'config',
                                itemId: 'config',
                                editable: false,
                                autoScroll: true,
                                allowBlank: false,
                                multiSelect: false,
                                matchFieldWidth: false,
                                fieldLabel: i18n.getKey('group组件配置'),
                                displayField: 'description',
                                valueField: '_id',
                                store: configStore,
                                filterCfg: {
                                    hidden: true,
                                    layout: {
                                        type: 'column'
                                    },
                                    defaults: {
                                        margin: '5 0 5 0',
                                        isLike: false,
                                    },
                                    items: []
                                },
                                gridCfg: {
                                    store: configStore,
                                    height: 400,
                                    width: 900,
                                    autoScroll: true,
                                    columns: [
                                        {
                                            xtype: 'rownumberer',
                                            tdCls: 'vertical-middle',
                                            width: 60
                                        },
                                        {
                                            text: i18n.getKey('id'),
                                            dataIndex: '_id',
                                            width: 120
                                        },
                                        {
                                            text: i18n.getKey('description'),
                                            dataIndex: 'description',
                                            width: 120
                                        },
                                        {
                                            text: i18n.getKey('border'),
                                            dataIndex: 'border',
                                            width: 120
                                        },
                                        {
                                            text: i18n.getKey('attributeSchemaVersion'),
                                            dataIndex: 'attributeSchemaVersion',
                                            width: 120
                                        },
                                        {
                                            text: i18n.getKey('orientation'),
                                            dataIndex: 'orientation',
                                            width: 120
                                        },
                                        {
                                            text: i18n.getKey('templateCode'),
                                            dataIndex: 'template',
                                            flex: 1,
                                            renderer: function (value, metaData, record) {
                                                var result = value ? value['code'] : '';
                                                metaData.tdAttr = 'data-qtip="' + result + '"';
                                                return result;
                                            }
                                        },
                                    ],
                                    bbar: {
                                        xtype: 'pagingtoolbar',
                                        store: configStore,
                                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                                        emptyMsg: i18n.getKey('noData')
                                    }
                                },
                            },
                        ],
                        listeners: {
                            afterrender: function (form) {
                                var win = form.ownerCt,
                                    grid = win.outGrid,
                                    page = grid.ownerCt.ownerCt,
                                    publishProfileId = page.getComponent('publishProfiles').diyGetValueId(),
                                    publishProfileCodes = controller.getAttributeProfileData(me.productId, me.data.versionedProductAttributeId, publishProfileId),
                                    groupCode = form.getComponent('groupCode');

                                me.groupCodeStoreData = publishProfileCodes;
                                groupCode.store.proxy.data = publishProfileCodes;
                                groupCode.store.load();
                            }
                        }
                    }
                },
            },
            {
                xtype: 'gridfieldwithcrudv2',
                name: 'properties',
                itemId: 'properties',
                fieldLabel: i18n.getKey('attribute') + i18n.getKey('component') + i18n.getKey('config'),
                allowBlank: true,
                productAttributeStore: productAttributeStore,
                gridConfig: {
                    store: productAttributeStoreMemory,
                    maxHeight: 300,
                    layout: 'fit',
                    columns: [
                        {
                            xtype: 'rownumberer',
                            tdCls: 'vertical-middle',
                        },
                        {
                            text: i18n.getKey('attribute'),
                            width: 150,
                            dataIndex: 'attribute',
                            isLike: false,
                            xtype: 'atagcolumn',
                            getDisplayName: function (value, mateData, record) {
                                var me = this;
                                var items = [
                                    {
                                        title: i18n.getKey('id'),
                                        value: '<a href="#">' + value.id + '</a>'
                                    },
                                    {
                                        title: i18n.getKey('name'),
                                        value: value.name
                                    },
                                    {
                                        title: i18n.getKey('值输入方式'),
                                        value: value.selectType == 'MULTI' ? '多选' : '单选'
                                    }
                                ]
                                return JSCreateHTMLTable(items);
                            },
                            clickHandler: function (value) {
                                JSOpen({
                                    id: 'attributepage',
                                    url: path + 'partials/attribute/attribute.html?attributeId=' + value.id,
                                    title: i18n.getKey('attribute'),
                                    refresh: true
                                });
                            }
                        },
                        {
                            text: i18n.getKey('所属profile'),
                            dataIndex: 'componentType',
                            width: 100,
                            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                                var attributeId = record.get('attribute')?.id;
                                var productAttributeStore = this.ownerCt.ownerCt.productAttributeStore;
                                var attributeRecord = productAttributeStore?.findRecord('id', attributeId);
                                var profiles = attributeRecord?.raw?.profiles;
                                var data = profiles?.map(function (item) {
                                    return item.profileName;
                                })
                                return data ? JSAutoWordWrapStr(data?.toString()) : ''
                            }
                        },
                        {
                            text: i18n.getKey('component') + i18n.getKey('type'),
                            dataIndex: 'componentType',
                            width: 70
                        },
                        {
                            text: i18n.getKey('属性简述'),
                            dataIndex: 'shortDesc',
                            width: 150,
                            renderer: function (value, metaData, record) {
                                metaData.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('属性名称别名'),
                            dataIndex: 'nickName',
                            width: 120,
                            renderer: function (value, metaData, record) {
                                metaData.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('提示信息'),
                            dataIndex: 'guideUrl',
                            flex: 1,
                            renderer: function (value, metaData, record) {
                                var items = [];
                                var guidName = record.get('guideName');
                                if (guidName) {
                                    items.push({
                                        title: i18n.getKey('提示按钮名称'),
                                        value: guidName
                                    })
                                }
                                if (value) {
                                    items.push({
                                        title: i18n.getKey('提示信息跳转地址'),
                                        value: value
                                    })
                                }
                                return JSAutoWordWrapStr(JSCreateHTMLTable(items));
                            }
                        },
                    ]
                },
                winConfig: {
                    formConfig: {
                        defaults: {
                            msgTarget: 'none',
                            margin: '10 25',
                            width: 450,
                            labelWidth: 120,
                        },
                        items: [
                            {
                                xtype: 'gridcombo',
                                itemId: 'attribute',
                                name: 'attribute',
                                fieldLabel: i18n.getKey('属性名称'),
                                tipInfo: '属性选择范围是对应产品下的profile分组内的所有可配置属性,取并集!',
                                allowBlank: false,
                                editable: false,
                                matchFieldWidth: false,
                                multiSelect: false,
                                displayField: 'name',
                                valueField: 'id',
                                lastQuery: '',
                                gotoConfigHandler: function (event) {
                                    var me = this;
                                    var attributeId = this.getSubmitValue()[0];
                                    if (attributeId) {
                                        JSOpen({
                                            id: 'attributepage',
                                            url: path + 'partials/attribute/attribute.html?attributeId=' + attributeId,
                                            title: i18n.getKey('attribute'),
                                            refresh: true
                                        });
                                    }
                                },
                                setOptionsConfigVisible: function (isVisible) {
                                    var me = this,
                                        form = me.ownerCt,
                                        optionsComp = form.getComponent('options'),
                                        grid = optionsComp?._grid;

                                    if (grid) {
                                        grid.store.proxy.data = [];
                                        grid.store.load();
                                    }

                                    optionsComp.setVisible(isVisible);
                                },
                                store: productAttributeStore,
                                filterCfg: {
                                    mixHeight: 60,
                                    searchActionHandler: function (btn) { //重写本地查询
                                        var me = this,
                                            form = me.ownerCt.ownerCt,
                                            grid = form.ownerCt,
                                            store = grid.store,
                                            filterData = form.getQuery()

                                        if (filterData.length) {
                                            store.proxy.data = controller.getFilteredValues(filterData, newProductAttributeStoreData);
                                        } else {
                                            store.proxy.data = newProductAttributeStoreData;
                                        }
                                        store.load();
                                    },
                                    layout: {
                                        type: 'table',
                                        columns: 3
                                    },
                                    defaults: {
                                        isLike: false
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            name: 'id',
                                            itemId: 'id',
                                            hideTrigger: true,
                                            fieldLabel: i18n.getKey('id'),
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'name',
                                            itemId: 'name',
                                            fieldLabel: i18n.getKey('name'),
                                        },
                                        {
                                            xtype: 'combo',
                                            name: 'valueType',
                                            itemId: 'valueType',
                                            fieldLabel: i18n.getKey('值类型'),
                                            editable: false,
                                            haveReset: true,
                                            valueField: 'value',
                                            displayField: 'display',
                                            store: Ext.create('Ext.data.Store', {
                                                fields: [
                                                    'value', 'display'
                                                ],
                                                data: [
                                                    {
                                                        value: 'String',
                                                        display: 'String'
                                                    }, {
                                                        value: 'Number',
                                                        display: 'Number'
                                                    }, {
                                                        value: 'Boolean',
                                                        display: 'Boolean'
                                                    }
                                                ]
                                            }),
                                        },
                                    ]
                                },
                                gridCfg: {
                                    store: productAttributeStore,
                                    height: 400,
                                    width: 1000,
                                    autoScroll: true,
                                    selType: 'rowmodel',
                                    columns: [
                                        {
                                            text: i18n.getKey('id'),
                                            width: 100,
                                            dataIndex: 'id',
                                            itemId: 'id',
                                            sortable: true
                                        },
                                        {
                                            text: i18n.getKey('name'),
                                            dataIndex: 'name',
                                            width: 165,
                                            itemId: 'name',
                                            sortable: true
                                        },
                                        {
                                            text: i18n.getKey('所属profile'),
                                            dataIndex: 'componentType',
                                            renderer: function (value, metaData, record) {
                                                var profiles = record.raw.profiles;
                                                var data = profiles.map(function (item) {
                                                    return item.profileName;
                                                })
                                                return JSAutoWordWrapStr(data.toString())
                                            }
                                        },
                                        {
                                            text: i18n.getKey('valueType'),
                                            dataIndex: 'valueType',
                                            width: 120,
                                            itemId: 'valueType',
                                            sortable: true
                                        },
                                        {
                                            text: i18n.getKey('值输入方式'),
                                            dataIndex: 'selectType',
                                            width: 120,
                                            itemId: 'selectType',
                                            sortable: true,
                                            renderer: function (value, mate, record) {
                                                if (value == 'NON') {
                                                    return '手动输入';
                                                } else if (value == 'MULTI') {
                                                    return '多选';
                                                } else {
                                                    return '单选';
                                                }
                                            }
                                        },
                                        {
                                            text: i18n.getKey('options'),
                                            dataIndex: 'attributeOptions',
                                            flex: 1,
                                            xtype: 'uxarraycolumnv2',
                                            itemId: 'options',
                                            sortable: false,
                                            maxLineCount: 5,
                                            lineNumber: 2,
                                            minWidth: 200,
                                            showContext: function (id, title) {//自定义展示多数据时的方式
                                                var store = window.store;
                                                var record = store.findRecord('id', id);
                                                var data = [];
                                                for (var i = 0; i < record.get('options').length; i++) {
                                                    data.push({
                                                        option: record.get('options')[i].name
                                                    });
                                                }
                                                var win = Ext.create('Ext.window.Window', {
                                                    title: i18n.getKey('check') + i18n.getKey('options'),
                                                    height: 250,
                                                    width: 350,
                                                    layout: 'fit',
                                                    model: true,
                                                    items: {
                                                        xtype: 'grid',
                                                        border: false,
                                                        autoScroll: true,
                                                        columns: [
                                                            {
                                                                width: 50,
                                                                sortable: false,
                                                                xtype: 'rownumberer'
                                                            },
                                                            {
                                                                flex: 1,
                                                                text: i18n.getKey('options'),
                                                                dataIndex: 'option',
                                                                sortable: false,
                                                                menuDisabled: true,
                                                                renderer: function (value) {
                                                                    return value;
                                                                }
                                                            }

                                                        ],
                                                        store: Ext.create('Ext.data.Store', {
                                                            fields: [
                                                                {name: 'option', type: 'string'}
                                                            ],
                                                            data: data
                                                        })
                                                    }
                                                }).show();
                                            },
                                            renderer: function (v, record) {
                                                if (record.get('valueType') == 'Color') {
                                                    var colorName = v['name'];
                                                    var color = v['value'];
                                                    var colorBlock = new Ext.Template('<a class=colorpick style="background-color:{color}"></a>').apply({
                                                        color: color
                                                    });
                                                    return colorName + colorBlock;
                                                }
                                                return v['name'];
                                            }
                                        }
                                    ],
                                },
                                listeners: {
                                    change: function (field, newValue, oldValue) {
                                        var componentType = field.ownerCt.getComponent('componentType');
                                        var data = field.getArrayValue();
                                        if (newValue && data) {
                                            var recordId = data.id,
                                                selectType = data.selectType,
                                                isVisible = ['SINGLE', 'MULTI'].includes(selectType),
                                                rawData = field.store.proxy.reader.rawData,
                                                completeData = null;

                                            rawData.map(function (item) {
                                                if (item.id == recordId) {
                                                    completeData = item;
                                                }
                                            });
                                            if (completeData) {
                                                var selectType = completeData.selectType;
                                                componentType.setDisabled(false);
                                                var componentTypeArr = componentType.valueTypeMap[selectType]?.map(function (item) {
                                                    return {
                                                        value: item,
                                                        display: item
                                                    };
                                                });
                                                componentType.store.proxy.data = componentTypeArr;
                                                componentType.store.load();
                                                componentType.setValue();
                                            } else {
                                                console.log('找不到改属性')
                                            }
                                            field.setOptionsConfigVisible(isVisible);
                                        } else {
                                            componentType.setDisabled(true);
                                        }
                                    },
                                    expand: function () {
                                        //已经添加了的属性列表
                                        var excludeIds = [];
                                        var win = this.ownerCt.ownerCt;
                                        var data = win.outGrid.store.proxy.data;
                                        data.map(function (item) {
                                            excludeIds.push(item.attribute.id);
                                        });
                                        if (win.record) {
                                            var currentId = win.record.raw.attribute.id;
                                            excludeIds.splice(excludeIds.indexOf(currentId), 1);
                                        }
                                        this.store.clearFilter();
                                        this.store.load();
                                        this.store.filter(function (item) {
                                            return !Ext.Array.contains(excludeIds, item.getId());
                                        });

                                    }
                                }
                            },
                            {
                                xtype: 'combo',
                                name: 'componentType',
                                editable: false,
                                fieldLabel: i18n.getKey('component') + i18n.getKey('type'),
                                itemId: 'componentType',
                                displayField: 'display',
                                disabled: true,
                                valueField: 'value',
                                tipInfo: '选择产品页展示属性内容的组件框架类型!',
                                valueTypeMap: {
                                    "SINGLE": [
                                        'Chip', 'Select', 'Radio'
                                    ],
                                    'MULTI': [
                                        'Chip', 'Select', 'CheckBox'
                                    ],
                                    'NON': [
                                        'Input', 'Slider'
                                    ]
                                },
                                store: {
                                    xtype: 'store',
                                    fields: ['display', 'value'],
                                    data: [],
                                    proxy: {
                                        type: 'memory'
                                    }
                                },
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('提示按钮名称'),
                                itemId: 'guideName',
                                name: 'guideName',
                                allowBlank: true,
                            },
                            {
                                xtype: 'fileuploadv2',
                                fieldLabel: i18n.getKey('提示信息跳转地址'),
                                itemId: 'guideUrl',
                                name: 'guideUrl',
                                valueVtype: 'filePath',
                                UpFieldLabel: i18n.getKey('image'),
                                allowBlank: true,
                                isShowImage: true,        //是否显示预览图
                                imageSize: 50,            //预览图大小 width and height 也控制输入框大小
                                valueUrlType: 'part',   //完整路径 full, 部分路径 part, 文件信息 object
                            },
                            {
                                xtype: 'textarea',
                                fieldLabel: i18n.getKey('属性简述'),
                                allowBlank: true,
                                itemId: 'shortDesc',
                                name: 'shortDesc',
                                height: 50,
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('属性名称别名'),
                                allowBlank: true,
                                itemId: 'nickName',
                                name: 'nickName',
                                tipInfo: '在产品页中,将默认使用属性名称,若配置别名将优先使用别名!',
                            },
                            {
                                xtype: 'gridfieldwithcrudv2',
                                name: 'options',
                                itemId: 'options',
                                fieldLabel: i18n.getKey('属性选项值配置'),
                                hidden: true,
                                allowBlank: true,
                                width: 800,
                                gridConfig: {
                                    tbar: {
                                        hiddenButtons: ['read', 'clear', 'config', 'help', 'export', 'import'],
                                        btnDelete: {
                                            xtype: 'displayfield',
                                            width: 200,
                                            value: '选中行号拖拽调整选项顺序',
                                            fieldStyle: {
                                                color: 'red'
                                            },
                                        }
                                    },
                                    store: optionsStore,
                                    maxHeight: 300,
                                    layout: 'fit',
                                    viewConfig: {
                                        enableTextSelection: true,
                                        listeners: {
                                            drop: function (node, Object, overModel, dropPosition, eOpts) {
                                                var view = this;
                                                this.store.suspendAutoSync();//挂起数据同步
                                                view.ownerCt.suspendLayouts();
                                                view.store.suspendEvents(true);//挂起事件粗触发，false表示丢弃事件，true表示阻塞事件队列*/
                                                var data = this.store.data.items;
                                                for (var i = 0; i < data.length; i++) {
                                                    data[i].index = i;
                                                    data[i].set('sortOrder', i);
                                                }
                                                this.store.sync({
                                                    callback: function () {
                                                        view.store.resumeEvents();//恢复事件触发
                                                        view.ownerCt.resumeLayouts();
                                                    }
                                                });//同步数据
                                            }
                                        },
                                        plugins: {
                                            ptype: 'gridviewdragdrop',
                                            dragText: 'Drag and drop to reorganize',
                                        }
                                    },
                                    columns: [
                                        {
                                            xtype: 'rownumberer',
                                            tdCls: 'vertical-middle',
                                            align: 'center',
                                            width: 60
                                        },
                                        {
                                            text: i18n.getKey('选项编号'),
                                            dataIndex: 'optionId',
                                            width: 150,
                                            renderer: function (value, metaData, record) {
                                                metaData.tdAttr = 'data-qtip="' + value + '"';
                                                return value;
                                            }
                                        },
                                        {
                                            xtype: 'imagecolumn',
                                            text: i18n.getKey('图片'),
                                            dataIndex: 'imageUrl',
                                            width: 150,
                                            buildUrl: function (value) {
                                                var imgSize = '/100/100/png?' + Math.random();
                                                return (imageServer + value + imgSize);
                                            },
                                            buildPreUrl: function (value) {
                                                return (imageServer + value);
                                            },
                                            buildTitle: function (value, metadata, record) {
                                                return `预览图`;
                                            },
                                        },
                                        {
                                            text: i18n.getKey('选项简述'),
                                            dataIndex: 'shortDesc',
                                            width: 150,
                                            renderer: function (value, metaData, record) {
                                                metaData.tdAttr = 'data-qtip="' + value + '"';
                                                return value;
                                            }
                                        },
                                        {
                                            text: i18n.getKey('显示名称'),
                                            dataIndex: 'displayName',
                                            flex: 1,
                                            renderer: function (value, metaData, record) {
                                                metaData.tdAttr = 'data-qtip="' + value + '"';
                                                return value;
                                            }
                                        },
                                    ]
                                },
                                winConfig: {
                                    formConfig: {
                                        height: 300,
                                        width: 600,
                                        defaults: {
                                            msgTarget: 'none',
                                            margin: '10 25',
                                            width: 450,
                                            labelWidth: 120,
                                            allowBlank: true
                                        },
                                        items: [
                                            {
                                                xtype: 'gridcombo',
                                                fieldLabel: i18n.getKey('选项名称'),
                                                name: 'optionId',
                                                itemId: 'optionId',
                                                valueField: 'id',
                                                displayField: 'name',
                                                allowBlank: false,
                                                editable: false,
                                                matchFieldWidth: false,
                                                multiSelect: false,
                                                store: attributeOptionsStore,
                                                diyGetValue: function () {
                                                    var me = this,
                                                        data = me.getArrayValue();

                                                    return data['id'];
                                                },
                                                diySetValue: function (data) {
                                                    JSSetLoading(true);
                                                    setTimeout(() => {
                                                        if (data) {
                                                            var me = this,
                                                                storeData = me.store.proxy.data;

                                                            storeData.forEach(item => {
                                                                if (item['id'] === +data) {
                                                                    me.setValue(item);
                                                                }
                                                            })
                                                        }
                                                        JSSetLoading(false);
                                                    }, 1000)
                                                },
                                                gridCfg: {
                                                    store: attributeOptionsStore,
                                                    height: 300,
                                                    width: 600,
                                                    autoScroll: true,
                                                    selType: 'rowmodel',
                                                    columns: [
                                                        {
                                                            text: i18n.getKey('id'),
                                                            dataIndex: 'id',
                                                            itemId: 'id',
                                                            sortable: true,
                                                            width: 120
                                                        },
                                                        {
                                                            text: i18n.getKey('name'),
                                                            dataIndex: 'name',
                                                            itemId: 'name',
                                                            sortable: true,
                                                            flex: 1,
                                                        },
                                                        {
                                                            text: i18n.getKey('value'),
                                                            dataIndex: 'value',
                                                            itemId: 'value',
                                                            sortable: true,
                                                            flex: 1,
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                xtype: 'numberfield',
                                                name: 'sortOrder',
                                                itemId: 'sortOrder',
                                                hidden: true,
                                                fieldLabel: i18n.getKey('排序'),
                                                value: 999
                                            },
                                            {
                                                xtype: 'textarea',
                                                name: 'displayName',
                                                itemId: 'displayName',
                                                allowBlank: false,
                                                fieldLabel: i18n.getKey('显示值'),
                                                height: 50
                                            },
                                            {
                                                xtype: 'textarea',
                                                name: 'shortDesc',
                                                itemId: 'shortDesc',
                                                fieldLabel: i18n.getKey('选项简述'),
                                                height: 50
                                            },
                                            {
                                                xtype: 'fileuploadv2',
                                                width: 450,
                                                hideTrigger: false,
                                                isFormField: true,
                                                isShowImage: true,
                                                imageSize: 50,
                                                valueUrlType: 'part',
                                                allowFileType: ['image/*'],
                                                msgTarget: 'none',
                                                fieldLabel: i18n.getKey('图片'),
                                                emptyText: '可自行输入 例: aa/bb/cc',
                                                name: 'imageUrl',
                                                itemId: 'imageUrl',
                                                tipInfo: '产品页展示建议使用宽高比例为 3:4 的图片!',
                                            },
                                        ],
                                        listeners: {
                                            afterrender: function (form) {
                                                var win = form.ownerCt,
                                                    record = win.record,
                                                    recordOptionId = record?.get('optionId'),
                                                    createOrEdit = win.createOrEdit,
                                                    isEdit = createOrEdit !== 'create',
                                                    optionIdComp = form.getComponent('optionId'),
                                                    optionsComp = win.outGrid,
                                                    ownerCtForm = optionsComp.ownerCt.ownerCt,
                                                    attributeComp = ownerCtForm.getComponent('attribute'),
                                                    attribute = attributeComp.getArrayValue(),
                                                    options = attribute['options'], //因为无法分辨选项是否被启用 所以更换
                                                    attributeOptions = attribute['attributeOptions'],
                                                    newOptions = (attributeOptions?.length) ? attributeOptions : options,
                                                    needFilterId = [];

                                                optionsComp.store.proxy.data.forEach(item => {
                                                    if (isEdit) {
                                                        if (item['optionId'] !== +recordOptionId) { //编辑排除本身optionId
                                                            needFilterId.push(item['optionId'])
                                                        }
                                                    } else {
                                                        needFilterId.push(item['optionId'])
                                                    }
                                                })

                                                optionIdComp.store.proxy.data = controller.getFilterOptionsArr(newOptions, needFilterId);
                                                optionIdComp.store.load();
                                            }
                                        }
                                    },
                                },
                            },
                        ]
                    }
                },
            },
            {
                xtype: 'gridfieldhascomplementarydata',
                name: 'relatedProductIds',
                itemId: 'relatedProductIds',
                allowBlank: true,
                fieldLabel: i18n.getKey('相关产品'),
                autoScroll: true,
                maxHeight: 350,
                dataWindowCfg: {
                    width: 950
                },
                searchGridCfg: {
                    gridCfg: {
                        editAction: false,
                        deleteAction: false,
                        storeCfg: {//配置store的所有参数，只是把创建store推后到新建弹窗时
                            clazz: 'CGP.product.store.ProductStore',
                            proxy: {
                                type: 'uxrest',
                                url: adminPath + 'api/cms-configs/avilale/products/v2',
                                reader: {
                                    type: 'json',
                                    root: 'data.content'
                                }
                            },
                        },
                    },
                    filterCfg: {
                        listeners: {
                            afterrender: function (comp) {
                                comp.getComponent('excludeIds').setValue(me.productId + '');
                                //Ext.getCmp('excludeIds').setValue(me.productId +'');
                            }
                        },
                        header: false,
                        items: [
                            {
                                xtype: 'numberfield',
                                fieldLabel: i18n.getKey('id'),
                                name: 'id',
                                itemId: 'id',
                                hideTrigger: true,
                                isLike: false,
                                labelWidth: 40
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('name'),
                                name: 'name',
                                itemId: 'name',
                                labelWidth: 40
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('sku'),
                                name: 'sku',
                                itemId: 'sku',
                                labelWidth: 40
                            }, {
                                xtype: 'textfield',
                                name: 'excludeIds',
                                hidden: true,
                                value: function () {
                                    me.filterDate = '';
                                    if (Ext.isEmpty(me.filterDate)) {
                                        return;
                                    } else if (Ext.isString(me.filterDate)) {
                                        return me.filterDate;
                                    } else {
                                        var value = [];
                                        for (var i = 0; i < me.filterDate.length; i++) {
                                            value.push(me.filterDate[i].get("id"));
                                        }
                                        return value.join(",");
                                    }
                                }()
                            }
                        ]
                    }
                },
                gridConfig: {
                    width: 550,
                    autoScroll: true,
                    viewConfig: {
                        enableTextSelection: true
                    },
                    store: relatedProductsStore,
                    bbar: {//底端的分页栏
                        xtype: 'pagingtoolbar',
                        store: relatedProductsStore,
                        emptyMsg: i18n.getKey('noData')
                    },
                    mxHeight: 300,
                    layout: 'fit',
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            width: 80,
                            dataIndex: 'id'
                        },
                        {
                            text: i18n.getKey('name'),
                            width: 200,
                            dataIndex: 'name'
                        },
                        {
                            text: i18n.getKey('sku'),
                            width: 200,
                            flex: 1,
                            dataIndex: 'sku'
                        },
                        {
                            text: i18n.getKey('type'),
                            width: 200,
                            flex: 1,
                            dataIndex: 'type'
                        }]
                },
            },
            {
                name: 'shortDesc',
                xtype: 'diy_html_editor',
                fieldLabel: i18n.getKey('shortDescription'),
                itemId: 'shortDesc',
                minHeight: 250,
            },
            {
                xtype: 'diy_html_editor',
                name: 'specifications',
                fieldLabel: i18n.getKey('specification') + i18n.getKey('description'),
                itemId: 'specifications',
                minHeight: 250,
            },
            {
                xtype: 'diy_html_editor',
                name: 'productDesc',
                fieldLabel: i18n.getKey('product') + i18n.getKey('description'),
                itemId: 'productDesc',
                minHeight: 250,
            }
        ];

        me.callParent(arguments);
        me.on('afterrender', function () {
            var parentTab = me.ownerCt;
            me.productId = parentTab.productId;
            if (me.data) {
                if (Ext.isEmpty(me.data.versionedProductAttributeId)) {
                    /*            me.getComponent('getAttributeVersionType').hide();
                                me.getComponent('versionedProductAttributeId').hide();
                                me.getComponent('getAttributeVersionType').setDisabled(true);
                                me.getComponent('versionedProductAttributeId').setDisabled(true);
                                me.getComponent('getAttributeVersionType').setDisabled(true);*/
                }
                /*   setTimeout(function () {
                       me.setValue(me.data);
                   }, 1500);*/
            }
        })
    },
    isValid: function () {
        var me = this;
        this.msgPanel.hide();
        if (me.rendered) {
            if (this.isValidForItems == true) {//以form.items.items为遍历
                var isValid = true,
                    errors = {};
                this.items.items.forEach(function (f) {
                    if (!f.isValid()) {
                        var errorInfo = f.getErrors();
                        if (Ext.isObject(errorInfo) && !Ext.Object.isEmpty(errorInfo)) {//处理uxfieldContainer的错误信息
                            errors = Ext.Object.merge(errors, errorInfo);
                        } else {
                            errors[f.getFieldLabel()] = errorInfo;
                        }
                        isValid = false;
                    }
                });
                isValid ? null : this.showErrors(errors);
                return isValid;
            } else {//以form.getFields为遍历
                var isValid = this.callParent(arguments),
                    errors = {};
                if (!isValid) {
                    this.form.getFields().each(function (f) {
                        if (!f.isValid()) {
                            errors[f.getFieldLabel()] = f.getErrors();
                        }
                    });
                }
                isValid ? null : this.showErrors(errors);
                return isValid;
            }
        } else {
            return !Ext.isEmpty(me.data);
        }
    },
})
