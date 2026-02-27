/**
 * 国家设置的编辑页面Extjs
 */
Ext.Loader.syncRequire(['CGP.cmspage.model.CmsPage', 'CGP.cmspage.customcomp.QueryFiledContainer']);

Ext.onReady(function () {


    var websiteStore = Ext.create("CGP.common.store.Website");


    //页面的url参数。如果id不为null。说明是编辑。
    var urlParams = Ext.Object.fromQueryString(location.search);
    var cmsPageModel = null;
    if (urlParams.id != null) {
        cmsPageModel = Ext.ModelManager.getModel("CGP.cmspage.model.CmsPage");
    }
    var controller = Ext.create('CGP.cmspage.controller.Controller');
    var name = {
        name: 'name',
        xtype: 'textfield',
        width: 450,
        fieldLabel: i18n.getKey('name'),
        itemId: 'name'
    };
    var outputUrl = {
        name: 'outputUrl',
        xtype: 'textfield',
        fieldLabel: i18n.getKey('outputUrl'),
        width: 450,
        itemId: 'outputUrl',
        allowBlank: false
    };
    var type = {
        name: 'type',
        xtype: 'combo',
        editable: false,
        width: 450,
        allowBlank: false,
        fieldLabel: i18n.getKey('type'),
        itemId: 'type',
        store: Ext.create('Ext.data.Store', {
            fields: ['type', "value"],
            data: [
                {
                    type: 'normal', value: 'normal'
                },
                {
                    type: 'product', value: 'product'
                }
            ]
        }),
        displayField: 'type',
        valueField: 'value',
        queryMode: 'local',
        listeners: {
            afterrender: function () {
                this.setDisabled(urlParams.id == null ? false : true);
            }
        }
    };

    var website = {
        fieldLabel: i18n.getKey('website'),
        name: 'website',
        itemId: 'website',
        xtype: 'combo',
        store: websiteStore,
        displayField: 'name',
        valueField: 'id',
        editable: false,
        value: 11,
        width: 450,
        diySetValue: function (data) {
            var me = this;
            me.setValue(data.id);
        },
        diyGetValue: function () {
            var me = this;
            var data = me.getValue();
            return {
                clazz: "com.qpp.cgp.domain.common.Website",
                id: data
            }
        }
    };
    var productFilter = {
        xtype: 'queryfieldcontainer',
        itemId: 'productFilterId',
        title: i18n.getKey('productFilter'),
        name: 'productFilterId',
        colspan: 2,
        width: 700,
        type: 'filter'
    };
    var productQuery = {
        xtype: 'queryfieldcontainer',
        title: i18n.getKey('productQuery'),
        itemId: 'productQuery',
        colspan: 2,
        width: 700,
        name: 'productQueryId',
        type: 'query'
    };
    var description = {
        name: 'description',
        xtype: 'textfield',
        width: 450,
        fieldLabel: i18n.getKey('description'),
        itemId: 'description'
    };
    var sourcePath = {
        name: 'sourcePath',
        xtype: 'textarea',
        fieldLabel: i18n.getKey('sourcePath'),
        width: 450,
        height: 120,
        itemId: 'sourcePath',
        allowBlank: false
    };
    var pageTitle = {
        name: 'pageTitle',
        xtype: 'textarea',
        allowBlank: false,
        width: 450,
        height: 120,
        fieldLabel: i18n.getKey('pageTitle'),
        itemId: 'pageTitle'
    };
    var pageKeywords = {
        name: 'pageKeywords',
        xtype: 'textarea',
        height: 120,
        width: 450,
        fieldLabel: i18n.getKey('pageKeywords'),
        itemId: 'pageKeywords'
    };
    var pageDescription = {
        name: 'pageDescription',
        xtype: 'textarea',
        colspan: 2,
        height: 120,
        width: 450,
        fieldLabel: i18n.getKey('pageDescription'),
        itemId: 'pageDescription'
    };
    var isActive = {
        name: 'enable',
        fieldLabel: i18n.getKey('isActivation'),
        itemId: 'enable',
        xtype: 'combo',
        width: 450,
        matchFieldWidth: true,
        triggerAction: 'all',
        store: Ext.create('Ext.data.Store', {
            fields: ['enable', 'viewvalue'],
            data: [{
                enable: true,
                viewvalue: i18n.getKey('yes')
            }, {
                enable: false,
                viewvalue: i18n.getKey('no')
            }]
        }),
        displayField: 'viewvalue',
        valueField: 'enable',
        queryMode: 'local',
        forceSelection: true,
        typeAheand: true
    }
    var editPage = Ext.create("Ext.container.Viewport", {
        layout: 'border',
        autoScroll: true,
        items: [{
            xtype: "form",
            bodyPadding: 25,
            region: 'center',
            layout: {
                type: 'table',
                columns: 2,
                itemCls: 'padding-right-ten',
                fieldBodyCls: 'padding-right-ten'
//        align: 'center'
            },
            autoScroll: true,
            defaults: {
                width: 500,
                labelAlign: 'right'
            },
            tbar: [{
                xtype: "button",
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function () {
                    var form = this.ownerCt.ownerCt;
                    if (form.isValid()) {
                        //利用promotionRuleModel来判断是修改还是新建
                        var mask = editPage.setLoading();
                        var items = form.items.items;
                        controller.saveCmsPage(items, cmsPageModel, mask);
                    }
                }
            }, {
                xtype: 'button',
                itemId: "copy",
                text: i18n.getKey('copy'),
                iconCls: 'icon_copy',
                disabled: urlParams.id != null ? false : true,
                handler: function () {
                    cmsPageModel = null;
//					urlParams.id = null;
                    this.setDisabled(true);
                    window.parent.Ext.getCmp("cmspage_edit").setTitle(i18n.getKey('create') + "_" + i18n.getKey('cmspage'));
                    var form = this.ownerCt.ownerCt;
                    Ext.Array.each(form.items.items, function (item) {
                        if (item.type == 'query' || item.type == 'filter') {
                            item.getComponent('id').setValue(null);
                        }
                    });
                }
            }, {
                xtype: 'button',
                itemId: 'btnReset'
                , text: i18n.getKey('reset')
                , iconCls: 'icon_reset',
                handler: function () {
                    if (urlParams.id != null) {
                        var model = Ext.ModelManager.getModel("CGP.cmspage.model.CmsPage");
                        model.load(Number(urlParams.id), {
                            success: function (record, operation) {
                                model = record;
                                var form = editPage.down('form');
                                Ext.Array.each(form.items.items, function (item) {
                                    item.setValue(record.get(item.name));
                                });
                            }
                        });
                    }
                }
            }],
            items: [name, type, website, description, isActive, outputUrl, sourcePath, pageKeywords, pageTitle, pageDescription, productQuery, productFilter]
        }],
        listeners: {
            render: function () {
                var me = this;
                if (urlParams.id != null) {
                    cmsPageModel.load(Number(urlParams.id), {
                        success: function (record, operation) {
                            cmsPageModel = record;
                            var form = me.down('form');
                            Ext.Array.each(form.items.items, function (item) {
                                if (item.diySetValue) {
                                    item.diySetValue(record.get(item.name));
                                } else {
                                    item.setValue(record.get(item.name));
                                }
                            });
                        }
                    });
                }
            }
        }

    });

});

