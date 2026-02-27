/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.define('partner.productSupplier.view.GridWindow', {
    extend: 'CGP.common.commoncomp.QueryGrid',
    alias: 'widget.expressiontemplategrid',
    tbarCfg: null,
    websiteId: null,
    partnerId: null,
    manufactureId: null,
    initComponent: function () {
        var me = this;
        var store = me.store || Ext.create('partner.productSupplier.store.EnableProductStore', {
            manufactureId: me.manufactureId
        });
        me.gridCfg = {
            store: store,
            frame: false,
            selType: 'simple',
            deleteAction: false,
            editAction: false,
            columns: [
                {
                    text: i18n.getKey('id'),
                    sortable: false,
                    dataIndex: '_id',
                    renderer: function (value, metaData, record) {
                        return record.raw.id || record.raw._id;
                    }

                },
                {
                    text: i18n.getKey('type'),
                    sortable: false,
                    dataIndex: 'type',
                    width: 130

                },
                {
                    xtype: 'auto_bread_word_column',
                    text: i18n.getKey('sku'),
                    sortable: false,
                    dataIndex: 'sku',
                    flex: 1,
                },
                {
                    xtype: 'auto_bread_word_column',
                    text: i18n.getKey('name'),
                    sortable: false,
                    dataIndex: 'name',
                    flex: 1,
                },
                {
                    xtype: 'auto_bread_word_column',
                    text: i18n.getKey('model'),
                    sortable: false,
                    dataIndex: 'model',
                    flex: 1,
                },
            ],
        };
        me.filterCfg = {
            header: false,
            defaults: {
                isLike: false,
            },
            items: [
                {
                    xtype: 'numberfield',
                    name: '_id',
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
                    xtype: 'textfield',
                    name: 'model',
                    itemId: 'model',
                    fieldLabel: i18n.getKey('model'),
                },
                {
                    name: 'type',
                    xtype: 'combo',
                    itemId: 'type',
                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', "value"],
                        data: [
                            {
                                type: 'Sku', value: 'SKU'
                            },
                            {
                                type: 'Configurable', value: 'CONFIGURABLE'
                            }
                        ]
                    }),
                    displayField: 'type',
                    valueField: 'value',
                    queryMode: 'local',
                    fieldLabel: i18n.getKey('类型'),
                },
                {
                    xtype: 'textfield',
                    name: 'sku',
                    itemId: 'sku',
                    fieldLabel: i18n.getKey('SKU'),
                },
                {
                    name: 'configurableProduct.id',
                    xtype: 'numberfield',
                    itemId: 'configurableId',
                    minValue: 1,
                    allowDecimals: false,
                    allowExponential: false,
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('可配置产品编号'),
                },
                {
                    name: 'mainCategory',
                    xtype: 'productcategorycombo',
                    itemId: 'mainCategory',
                    isMain: true,
                    defaultWebsite: me.websiteId,
                    websiteSelectorEditable: me.websiteId ? false : true,
                    displayField: 'name',
                    valueField: 'id',
                    isLike: false,
                    selectChildren: false,
                    canSelectFolders: true,
                    multiselect: true,
                    fieldLabel: i18n.getKey('主类目'),
                },
                {
                    name: 'subCategories',
                    xtype: 'productcategorycombo',
                    itemId: 'subCategories',
                    isMain: false,
                    isLike: false,
                    displayField: 'name',
                    defaultWebsite: me.websiteId || 11,
                    websiteSelectorEditable: me.websiteId ? false : true,
                    valueField: 'id',
                    selectChildren: false,
                    canSelectFolders: true,
                    multiselect: true,
                    fieldLabel: i18n.getKey('产品类目'),
                },
                {
                    name: 'mainCategory.website.id',
                    xtype: 'combobox',
                    fieldLabel: i18n.getKey('网站'),
                    itemId: 'website',
                    store: Ext.create("CGP.common.store.Website"),
                    displayField: 'name',
                    valueField: 'id',
                    hidden: true,
                    value: me.websiteId,
                    editable: false
                }
            ]
        };
        me.callParent();
    },
})