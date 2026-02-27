/**
 * @Description:
 * @author nan
 * @date 2022/4/28
 */
Ext.syncRequire([
    'CGP.cmsconfig.view.BaseInfo',
    'CGP.cmsconfig.view.Filters',
    'CGP.cmsconfig.view.ProductImage',
    'CGP.cmsconfig.view.SEO',
    'CGP.cmsconfig.view.ProductInfo',
    'CGP.cmsconfig.model.CmsConfigModel',
    'CGP.cmsconfig.view.Filters',
    'CGP.product.view.productattributeprofile.model.ProfileModel',
    'CGP.product.view.productattributeprofile.store.ProfileStore',
    'CGP.cmsconfig.store.CategoryProductInfoStore',
    'CGP.cmsconfig.view.SpecificationItems',
]);
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var type = JSGetQueryString('type');
    var id = JSGetQueryString('id');
    var productAttributeStore = Ext.create('CGP.cmsconfig.store.productAttributeStore', {
        productId: null
    });
    var publishProfilesStore = Ext.create('CGP.product.view.productattributeprofile.store.ProfileStore', {
        autoLoad: false,
    });
    var categoryProductInfoStore = Ext.create('CGP.cmsconfig.store.CategoryProductInfoStore', {
        categoryId: null,
        autoLoad: false,
    });
    var attributeVersionStore = Ext.create('CGP.cmsconfig.store.AttributeVersionStore', {
        autoLoad: false,
    });
    var items = null;
    if (type === 'ProductDetail') {
        items = [
            {
                xtype: 'cmsbaseinfo',
                itemId: 'baseInfo'
            },
            {
                xtype: 'productinfo',
                itemId: 'productInfo',
                disabled: true,
                publishProfilesStore: publishProfilesStore,
                productAttributeStore: productAttributeStore,
                attributeVersionStore: attributeVersionStore
            },
            {
                xtype: 'productimage',
                itemId: 'productImage',
                disabled: true,
            },
            {
                xtype: 'seo',
                itemId: 'seo',
            },
            {
                xtype: 'specification_items',
                itemId: 'specificationItems',
            }
        ]
    } else if (type === 'ProductCategory') {
        items = [
            {
                xtype: 'cmsbaseinfo',
                itemId: 'baseInfo'
            },
            {
                xtype: 'filters',
                itemId: 'filters',
                disabled: true,
                categoryProductInfoStore: categoryProductInfoStore
            },
            {
                xtype: 'seo',
                itemId: 'seo',
            }
        ]
    } else if (type === 'NormalPage') {
        items = [
            {
                xtype: 'cmsbaseinfo',
                itemId: 'baseInfo'
            },
            {
                xtype: 'seo',
                itemId: 'seo',
            }
        ]
    }

    var tab = Ext.create('Ext.tab.Panel', {
        productAttributeStore: productAttributeStore,//产品属性的store
        publishProfilesStore: publishProfilesStore,//产品profile的store
        categoryProductInfoStore: categoryProductInfoStore,//指定类目下的产品信息
        attributeVersionStore: attributeVersionStore,//属性版本用到的store
        imageSizeLimits: null,//图片约束信息
        data: null,
        productId: null,
        buildAttributeStoreData: function (publishProfilesStore, productAttributeStore, profiles) {
            var attributes = new Map();
            productAttributeStore.removeAll();
            productAttributeStore.proxy.data = [];
            for (var i = 0; i < profiles.length; i++) {
                //找到对应的profile取出其对应的属性列表
                var record = publishProfilesStore.findRecord('_id', profiles[i]);
                if (record) {
                    var groups = record.raw.groups,
                        profileId = record.raw._id,
                        profileName = record.raw.name;

                    groups.map(function (item) {

                        item.attributes.map(function (skuAttribute) {
                            var attributeId = skuAttribute.attribute.id,
                                attributeOptions = skuAttribute?.attributeOptions,
                                attribute = attributes.get(attributeId) || Ext.clone(skuAttribute.attribute);

                            attribute.profiles = attribute.profiles || [];

                            if (attributeOptions) {
                                attribute['attributeOptions'] = attributeOptions;
                            }

                            attribute.profiles.push({
                                _id: profileId,
                                profileName: profileName
                            });
                            attributes.set(attributeId, attribute);
                        })
                    });
                }

            }
            return [...attributes.values()];
        },
        getValue: function () {
            var result = {};
            var me = this;
            for (var i = 0; i < me.items.items.length; i++) {
                var item = me.items.items[i];
                if (item.itemId == 'editFilterWin' || item.itemId == 'editProductFilterWin') {
                } else {
                    var data = item.diyGetValue ? item.diyGetValue() : item.getValue();
                    Ext.Object.merge(result, data);
                }
            }
            return result;
        },
        setValue: function (data) {
            var me = this;
            me.data = data;
            for (var i = 0; i < me.items.items.length; i++) {
                var item = me.items.items[i];
                if (item.itemId == 'editFilterWin' || item.itemId == 'editProductFilterWin') {
                } else {
                    if (item.diySetValue) {
                        item.diySetValue(data);
                    } else {
                        item.setValue(data);
                    }
                }
            }
        },
        reset: function () {
            var me = this;
            for (var i = 0; i < me.items.items.length; i++) {
                var item = me.items.items[i];
                item.reset();
            }
        },
        isValid: function () {
            var me = this;
            var isValid = true;
            for (var i = 0; i < me.items.items.length; i++) {
                var item = me.items.items[i];
                if (item.isValid() == false) {
                    me.setActiveTab(item);
                    isValid = false;
                    break;
                }
            }
            return isValid;
        },
        listeners: {
            tabchange: function (tabPanel, newCard, oldCard, eOpts) {
                var toolbar = tabPanel.getDockedItems('toolbar[dock="top"]')[0];
                if (newCard.itemId == 'productInfo') {
                    newCard.loadData();
                }
                toolbar.setVisible(newCard.itemId != 'editFilterWin' && newCard.itemId != 'editProductFilterWin');
            },
            afterrender: function () {
                var tab = this;
                if (id) {
                    JSSetLoading(true);
                    CGP.cmsconfig.model.CmsConfigModel.load(id, {
                        scope: this,
                        success: function () {

                        },
                        failure: function () {

                        },
                        callback: function (record, reader) {
                            JSSetLoading(false);
                            if (record) {
                                tab.setValue(record.getData());
                            }
                        }
                    })
                }
            }
        },
        tbar: {
            xtype: 'uxedittoolbar',
            btnSave: {
                handler: function (btn) {
                    var tab = btn.ownerCt.ownerCt;
                    if (tab.isValid()) {
                        var data = tab.getValue();
                        var controller = Ext.create('CGP.cmsconfig.controller.Controller');
                        controller.saveCMSConfig(tab, data);
                        console.log(data);
                    }
                }
            },
            btnGrid: {
                disabled: true,
                handler: function () {
                    JSOpen({
                        id: 'cmsconfigpage',
                        url: path + 'partials/cmsconfig/main.html'
                    });
                }
            },
            btnReset: {
                disabled: true,
                handler: function () {
                    tab.reset();
                }
            },
            btnCreate: {
                hidden: true,
            },
            btnConfig: {
                disabled: true
            },
            btnHelp: {
                text: '特殊字符对照表',
                disabled: false,
                handler: function () {
                    var win = Ext.create('Ext.window.Window', {
                        modal: true,
                        constrain: true,
                        title: '特殊字符对照表',
                        layout: 'fit',
                        width: 450,
                        items: [{
                            xtype: 'grid',
                            store: {
                                xtype: 'store',
                                fields: [
                                    'key', 'value'
                                ],
                                data: [
                                    /*   {key: "& (且符号)", value: "&amp;",},
                                       {key: "< (小于号)", value: '&lt;',},
                                       {key: "> (大于号)", value: '&gt;',},
                                       {key: "  (空字符)", value: '&nbsp;',},*/
                                    {key: "’ (单引号)", value: `&#039;`,},
                                    {key: '" (双引号)', value: '&quot;',},
                                    {key: '\\n (换行符)', value: '<br>'},
                                ]
                            },
                            columns: [
                                {
                                    flex: 1,
                                    dataIndex: 'key',
                                    text: '字符'
                                },
                                {
                                    flex: 1,
                                    dataIndex: 'value',
                                    text: '转义字符',
                                    renderer: function (value) {
                                        return Ext.util.Format.htmlEncode(value)
                                    }
                                }
                            ]

                        }]
                    });
                    win.show();
                }
            },
            btnCopy: {
                hidden: true,
            }
        },
        items: items
    });
    page.add(tab);
});