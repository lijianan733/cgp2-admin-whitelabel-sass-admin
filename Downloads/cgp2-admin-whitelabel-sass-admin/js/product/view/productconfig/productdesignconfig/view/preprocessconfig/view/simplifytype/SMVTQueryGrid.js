/**
 * Created by admin on 2021/05/27.
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.SMVTQueryGrid", {
    extend: 'CGP.common.commoncomp.QueryGrid',
    // designId:null,

    initComponent: function () {
        var me = this;
        var smvtStore =Ext.data.StoreManager.lookup('smvtStore');
        me.gridCfg = {
            editAction: false,
            deleteAction: false,
            store: smvtStore,
            defaults: {
                width: 180
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'componentcolumn',
                    renderer: function (value, matete, record) {
                        return value
                    }
                },
                {
                    text: i18n.getKey('name'),
                    flex: 1,
                    dataIndex: 'name',
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'clazz',
                    itemId: 'clazz',
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        return value.split('.').pop();
                    }
                }
            ],

        }
        me.filterCfg = {
            height: 80,
            width: 480,
            header: false,
            layout: {
                type: 'column',
                columns: 2
            },
            fieldDefaults: {
                labelAlign: 'right',
                layout: 'anchor',
                style: 'margin-right:20px; margin-top : 5px;',
                labelWidth: 70,
                width: 220,
            },
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id'
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    name: 'productConfigDesignId',
                    xtype: 'textfield',
                    columnWidth: 0,
                    value: JSGetQueryString('designId'),
                    isLike: false,
                    hidden: true,
                    fieldLabel: i18n.getKey('designId'),
                    itemId: 'designId'
                }
            ]
        };
        me.callParent(arguments);
    }

});
