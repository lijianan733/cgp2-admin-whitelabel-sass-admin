/**
 * @Description:CMS 销售类目和产品类目
 * @author nan
 * @date 2024/3/28
 */

Ext.Loader.syncRequire([
    'CGP.productcatalog.store.ProductCatalogStore'
])
Ext.define('CGP.cmsconfig.view.CatalogGridCombo', {
    extend: 'Ext.ux.tree.UxTreeComboHasPaging',
    alias: 'widget.catalog_gridcombo',
    fieldLabel: i18n.getKey('catalog'),
    displayField: 'name',
    valueField: 'id',
    infoUrl: adminPath + 'api/productCategories/{id}/detail',
    editable: false,
    treeWidth: 600,//默认treePaneL的宽度
    multiselect: false,
    showAsProductCatalog: true,
    defaultColumnConfig: {
        text: i18n.getKey('name'),
        renderer: function (value, metadata, record) {
            return value + ' (<font color="green">' + record.getId() + '</font>)';
        }
    },
    diyGetValue: function () {
        var data = this.getValue();
        if (data) {
            return Number(data);
        }
    },
    initComponent: function () {
        var me = this;
        me.store = Ext.create('CGP.productcatalog.store.ProductCatalogStore', {
            root: {
                id: '-1',
                name: ''
            },
            autoSync: false,
            params: {
                website: 11,
                isMain: false,
                filter: '[{"name": "publishStatus", "type": "number", "value":1},' +
                    '{"name": "showAsProductCatalog", "type": "boolean", "value":' + me.showAsProductCatalog + '}]',
                limit: 25,
            }
        });
        me.filterCfg = {
            layout: {
                type: 'column',
                columns: 2
            },
            height: 65,
            items: [
                {
                    name: '_id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                //是否作为营销类目 false为营销类目，true为普通产品子类目
                {
                    xtype: 'booleancombo',
                    fieldLabel: i18n.getKey('id'),
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
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('name'),
                    name: 'publishStatus',
                    itemId: 'status',
                    allowBlank: false,
                    defaultValue: null,
                    displayField: 'name',
                    valueField: 'value',
                    value: 1,
                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [
                            {name: '启用', value: 1},
                            {name: '弃用', value: 2}
                        ]
                    }),
                }
            ]
        };
        me.callParent();
    }
})

