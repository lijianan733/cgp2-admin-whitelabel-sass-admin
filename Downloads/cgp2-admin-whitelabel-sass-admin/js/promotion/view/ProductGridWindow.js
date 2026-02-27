/**
 * @author xiu
 * @date 2023/10/24
 */
Ext.define('CGP.promotion.view.ProductGridWindow', {
    extend: 'CGP.common.commoncomp.QueryGrid',
    alias: 'widget.productGridWindow',
    tbarCfg: null,
    websiteId: 11,
    storeFilter: null,
    initComponent: function () {
        var me = this,
            store = Ext.create('CGP.cmspage.store.ProductStore'),
            extraParamsData = [
                {
                    "name": "mainCategory.website.id",
                    "value": me.websiteId,
                    "type": "number"
                }
            ];

        !Ext.isEmpty(me.storeFilter) && extraParamsData.push(
            {
                "name": "excludeIds",
                "value": JSON.stringify(me.storeFilter),
                "type": "number",
            },
        )
        store.proxy.extraParams = {
            filter: Ext.JSON.encode(extraParamsData)
        };
        me.gridCfg = {
            store: store,
            frame: false,
            selType: 'simple',
            editAction: false,
            deleteAction: false,
            columns: [
                {
                    text: i18n.getKey('id'),
                    sortable: false,
                    dataIndex: 'id',
                    flex: 1,
                },
                {
                    text: i18n.getKey('type'),
                    sortable: false,
                    dataIndex: 'type',
                    flex: 1,
                },
                {
                    text: i18n.getKey('sku'),
                    sortable: false,
                    dataIndex: 'sku',
                    flex: 1,
                },
                {
                    text: i18n.getKey('name'),
                    sortable: false,
                    dataIndex: 'name',
                    flex: 1,
                },
                {
                    text: i18n.getKey('model'),
                    sortable: false,
                    dataIndex: 'model',
                    flex: 1,
                },
                {
                    text: i18n.getKey('maincategory'),
                    sortable: false,
                    dataIndex: 'mainCategory',
                    flex: 1,
                    renderer: function (mainCategory) {
                        return mainCategory.name;
                    }
                },
                {
                    text: i18n.getKey('subcategory'),
                    sortable: false,
                    dataIndex: 'subCategory',
                    flex: 1,
                }
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
                }
            ]
        };
        me.callParent();
    },
})
