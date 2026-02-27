Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'
]);
Ext.define("CGP.product.view.producepage.CmsPageGrid", {
    extend: 'CGP.common.commoncomp.QueryGrid',


    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

    },
    minWidth: 300,
    height: 400,

    initComponent: function () {
        var me = this;
        var store = Ext.create('CGP.product.view.producepage.CmsPageStore');
        var website = Ext.create("CGP.cmspage.store.Website");
        me.gridCfg = {
            store: store,
            editAction: false,
            multiSelect: false,
            selType: 'checkboxmodel',
            selModel: {mode: 'SINGLE'},
            deleteAction: false,
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 60,
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    sortable: true
                }, {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    itemId: 'name',
                    sortable: false,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        metadata.style = "font-weight:bold";
                        return value;
                    }

                }, {
                    text: i18n.getKey('type'),
                    dataIndex: 'type',
                    xtype: 'gridcolumn',
                    itemId: 'type',
                    sortable: false
                }, {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    xtype: 'gridcolumn',
                    itemId: 'description',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                }, {
                    text: i18n.getKey('outputUrl'),
                    dataIndex: 'outputUrl',
                    xtype: 'gridcolumn',
                    itemId: 'outputUrl',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                }, {
                    text: i18n.getKey('pageTitle'),
                    dataIndex: 'pageTitle',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'pageTitle',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                }, {
                    text: i18n.getKey('pageKeywords'),
                    dataIndex: 'pageKeywords',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'pageKeywords',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                }, {
                    text: i18n.getKey('pageDescription'),
                    dataIndex: 'pageDescription',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'pageDescription',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                }, {
                    text: i18n.getKey('website'),
                    dataIndex: 'website',
                    xtype: 'gridcolumn',
                    itemId: 'website',
                    sortable: false,
                    renderer: function (value) {
                        return website['name'];
                    }
                }
            ]

        };
        me.filterCfg = {
            height: 60,
            header: false,
            //hidden: true,
            defaults: {
                width: 280
            },
            items: [
                {
                    id: 'idSearchField',
                    name: 'id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                }, {
                    name: 'type',
                    xtype: 'combo',
                    editable: false,
                    hidden: true,
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
                    value: 'product',
                    valueField: 'value',
                    queryMode: 'local'
                }, {
                    id: 'nameSearchField',
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                }, {
                    name: 'website.id',
                    itemId: 'website',
                    xtype: 'websitecombo',
                    hidden: true,
                }
            ]
        };
        me.callParent(arguments);
    }
});
