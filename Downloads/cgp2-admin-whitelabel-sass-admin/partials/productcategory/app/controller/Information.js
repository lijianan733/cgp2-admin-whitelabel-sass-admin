Ext.define('CGP.productcategory.controller.Information', {
    extend: 'Ext.app.Controller',

    models: [
        'ProductCategory',
        'Attribute'
    ],
    stores: [
        'Attribute',
        'ProductCategory',
        'TrueOrFalseStore'
    ],
    views: [
        'productcategory.Tree',
        'productcategory.Information',
        'info.attribute.Attribute',
        'info.attribute.IncludedAttributes',
        'info.attribute.OtherAttributes',
        'info.attribute.Value',
        'info.attribute.ButtonPanel',
        'info.Desc',
        'info.Template'
    ],

    refs: [{
        ref: 'tree',
        selector: 'productcategorytree'
    }, {
        ref: 'information',
        selector: 'productcategoryinfo'
    }, {
        ref: 'included',
        selector: 'includedattributes'
    }, {
        ref: 'other',
        selector: 'otherattributes'
    }, {
        ref: 'desc',
        selector: 'infodesc'
    }, {
        ref: 'template',
        selector: 'infotemplate'
    }, {
        ref: 'valueWindow',
        selector: 'attributevalue'
    }],

    constructor: function (config) {

        this.callParent(arguments);
    },
    init: function () {

        this.control({
            'productcategoryinfo button[action=save]': {
                click: this.saveInformation
            },
            'includedattributes button[action=setvalue]': {
                click: this.setValue
            },
            'otherattributes gridview': {
                'beforedrop': this.checkDropAttribute
            },
            'otherattributes button[action=search]': {
                click: this.searchAttribute
            },
            'attributevalue button[action=confirmvalue]': {
                click: this.confirmValue
            },
            'buttonpanel button[action=addAttribute]': {
                click: this.addAttribute
            },
            'buttonpanel button[action=removeAttribute]': {
                click: this.removeAttribute
            },
            'productcategoryinfo image[action=expand]': {
                render: this.expand
            }
        });

    },
    expand: function () {
        var me = this;
        var image = me.getInformation().header.child("toolbar").child("image");
        var tree = me.getTree();
        image.el.on("click", function (e, t, eOpts) {
            if (!tree.collapsed) {
                tree.collapse();
                image.setSrc("../../ClientLibs/extjs/resources/themes/images/ux/layout_right.png");
            } else {
                tree.expand();
                image.setSrc("../../ClientLibs/extjs/resources/themes/images/ux/layout_left.png");
            }
        });
    },

    saveInformation: function () {

        var me = this;

        var information = me.getInformation();

        if (!information.componentInit) {
            Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('noCategorySelected'));
        }


        var infoPanel = me.getInformation();
        var store = me.getTree().getStore();

        var data = {};


        //includeStore单独进行提交
        var attributes = [];
        if (me.getIncluded()) {
            var includeStore = me.getIncluded().getStore();
            includeStore.each(function (attribute) {
                var data = Ext.clone(attribute.data);
                data.options = [];
                attributes.push(data);
            });
            //设置mask膜防止重复提交。
            var mask = information.setLoading(true);

            Ext.Ajax.request({
                method: 'PUT',
                url: includeStore.getProxy().url,
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: attributes,
                success: function (response, options) {
                    var data = Ext.JSON.decode(response.responseText);

                    if (data.success) {
                        mask.hide(true);
                        Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveSuccess'));
                    } else {
                        if (data.message) {
                            mask.hide(true);
                            Ext.Msg.alet(i18n.getKey('info'), data.message);
                        } else {
                            mask.hide(true);
                            var records = data.data;
                            var productPanel = new Ext.grid.Panel({
                                region: 'center',
                                width: 600,
                                store: new Ext.data.Store({
                                    fields: ['title', 'name', 'model'],
                                    data: records,
                                    groupField: 'title'
                                }),
                                columns: [{
                                    dataIndex: 'name',
                                    flex: 1,
                                    text: 'name'
                                }, {
                                    dataIndex: 'model',
                                    flex: 1,
                                    text: 'model'
                                }],
                                features: [{
                                    id: 'group',
                                    ftype: 'groupingsummary',
                                    groupHeaderTpl: '{name}',
                                    hideGroupedHeader: true,
                                    enableGroupingMenu: false
                                }]
                            });

                            var window = new Ext.window.Window({
                                width: 800,
                                height: 600,
                                modal: true,
                                layout: 'border',
                                items: [productPanel]
                            })
                            window.show();
                            var recoverIds = [];
                            Ext.Array.each(records, function (record) {
                                recoverIds.push(record.id);
                            })
                            me.addAttribute(recoverIds);

                        }
                    }
                }
            });
        }


        infoPanel.items.each(function (form) {
            if (form.isXType('uxform'))
                data = Ext.merge(data, form.form.getValuesByModel('CGP.productcategory.model.ProductCategory'));
        });

        var currentNode = store.getNodeById(data.id);
        store.suspendAutoSync();
        Ext.Object.each(data, function (k, v) {
            currentNode.set(k, v);
        })
        if (!Ext.isEmpty(store.getModifiedRecords())) {
            //设置mask膜防止重复提交。
            var mask = information.setLoading(true);
            store.sync({
                success: function (batch, options) {
                    if (!me.getIncluded())
                        Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveSuccess'));
                },
                failure: function (batch, options) {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('savefailure'));
                },
                callback: function () {
                    mask.hide(true);
                }
            });
        } else {
            if (!me.getIncluded()) {
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveSuccess'));
            }
        }
        store.resumeAutoSync();
    },

    checkDropAttribute: function (node, data, overModel, dropPosition, dropHandlers, eOpts) {

        var me = this;

        if (data.records[0].get('belongToParent')) {
            Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('extendFromParent'));
            dropHandlers.cancelDrop();
            return;
        }
        //check is skuAttribute
        if (data.records[0].get('options'), length == 0) {
            return;
        }
        Ext.Ajax.request({
            async: false,
            url: adminPath + 'api/productCategories/' + me.getTree().getSelectionModel().getSelection()[0].get('id') + '/product/' + data.records[0].get('id') + '?access_token=' +
                Ext.util.Cookies.get('token'),
            method: 'GET',
            success: function (response, options) {
                var products = Ext.JSON.decode(response.responseText);
                if (products.data.length == 0)
                    return;
                dropHandlers.cancelDrop();
                var productPanel = new Ext.grid.Panel({
                    region: 'center',
                    store: new Ext.data.Store({
                        fields: ['name', 'model'],
                        data: products.data
                    }),
                    columns: [{
                        dataIndex: 'name',
                        text: 'name'
                    }, {
                        dataIndex: 'model',
                        text: 'model'
                    }]
                });

                var window = new Ext.window.Window({
                    title: data.records[0].get('name') + i18n.getKey('asSkuAttributeMsg'),
                    width: 800,
                    height: 600,
                    layout: 'border',
                    items: [productPanel],
                    bbar: [{
                        xtype: 'button',
                        text: 'Close',
                        handler: function () {
                            this.ownerCt.ownerCt.close();
                        }
                    }]
                })
                window.show();
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },

    searchAttribute: function () {
        var controller = this;
        var me = this.getOther();
        var name = me.getDockedItems('toolbar[dock="top"]')[0].getComponent('nameSearch').getValue();
        var recordId = me.child("toolbar").getComponent("id").getValue();
        var store = me.getStore();

        if (!Ext.isEmpty(name) || !Ext.isEmpty(recordId)) {
            store.filterBy(function (record, id) {
                var nameValidator = true, codeValidator = true;
                if (!Ext.isEmpty(name) && record.get('name').indexOf(name) <= -1) {
                    nameValidator = false;
                }
                if (!Ext.isEmpty(recordId) && record.get("id") != recordId) {
                    codeValidator = false;
                }
                if (nameValidator && codeValidator) {
                    return true;
                }
            }, store);

        } else {
            store.load({
                scope: store,
                callback: function (records, operation, success) {
                    if (success) {
                        this.filterBy(function (record) {
                            return controller.getIncluded().getStore().find('name', record.get('name')) == -1
                        }, this);
                    }
                }
            });
        }
    },
    setValue: function (button) {

        var me = this;
        var includeStore = me.getIncluded().getStore();

        var record = includeStore.getById(button.value);

        var valueWindow = me.getValueWindow();
        if (valueWindow) {
            valueWindow.refreshItems(record);
        } else {
            var window = Ext.widget({
                xtype: 'attributevalue',
                id: button.value,
                record: record
            })
            window.show();
        }

    },
    confirmValue: function () {

        var me = this;
        var includeStore = me.getIncluded().getStore();

        var record = includeStore.getById(me.getValueWindow().id);

        var item = me.getValueWindow().getComponent('value');
        var categoryId = me.getInformation().items.items[2].categoryId;
        if (item.xtype == 'datefield') {
            value = item.getSubmitValue();
        } else {
            value = item.getValue();
            //可能为对象 或者 String
            if (Ext.isObject(value)) {
                value = value[item.name];
                if (Ext.isArray(value)) {
                    value = value.join(',');
                }
            }
        }
        var sortOrder = me.getValueWindow().getComponent('sortOrder').getValue();
        if ((value || item.allowBlank)) {
            sortOrder || (sortOrder = 0);
            record.set('value', value);
            record.set('sortOrder', sortOrder);
            record.commit();
            includeStore.sort({
                property: 'sortOrder',
                directory: 'ASC'
            })
            Ext.Ajax.request({
                url: adminPath + 'api/productCategories/' + categoryId + '/single/attribute',
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: record.getData(),
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                        me.getValueWindow().close();
                        return;

                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            });
        }else{
            Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('AttributeValueBlank'));
        }
    },

    addAttribute: function (ids) {

        var me = this;
        var atrributes;
        var exclusiveTable = me.getOther();
        var includeTable = me.getIncluded();
        if (!Ext.isArray(ids)) {
            atrributes = exclusiveTable.getSelectionModel().getSelection();
        } else {
            if (Ext.isArray(ids)) {
                atrributes = [];
                Ext.Array.each(ids, function (id) {
                    atrributes.push(exclusiveTable.getStore().getById(id));
                })

            }
        }
        if (Ext.isEmpty(atrributes)) {
            return;
        }

        var newAttributes = [];
        Ext.Array.each(atrributes, function (attribute) {
            newAttributes.push(new CGP.productcategory.model.Attribute(attribute.data));
        })

        includeTable.getStore().loadData(newAttributes, true);
        exclusiveTable.getStore().remove(atrributes);
    },
    removeAttribute: function () {

        var me = this;
        var exclusiveTable = me.getOther();
        var includeTable = me.getIncluded();

        var attributes = includeTable.getSelectionModel().getSelection();
        if (Ext.isEmpty(attributes)) {
            return;
        }
        var allowAttributes = [];
        var notAllow = [];
        Ext.Array.each(attributes, function (attribute) {
            if (!attribute.get('belongToParent')) {
                allowAttributes.push(attribute);
            } else {
                notAllow.push(attribute.get('name'));
            }
        });
        exclusiveTable.getStore().loadData(allowAttributes, true);
        includeTable.getStore().remove(allowAttributes);
        if (notAllow.length > 0)
            Ext.Msg.alert(i18n.getKey('info'), notAllow.join(',') + i18n.getKey('extendFromParent'))
    }

})
