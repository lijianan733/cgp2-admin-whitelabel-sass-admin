/**
 * Created by nan on 2018/5/21.
 */
Ext.define('CGP.userdesigncategory.view.UserDesignDispalyPanel', {
    extend: 'Ext.panel.Panel',
    region: 'center',
    layout: 'fit',
    title: i18n.getKey('userDesign'),
    itemId: 'UserDesignDispalyPanel',
    initData: false,
    refreshData: function (categoryId, categoryName) {
        var me = this;
        var store = me.grid.down('grid').getStore();
        store.proxy.url = adminPath + 'api/userdesign/findAll';
        store.proxy.extraParams = {
            filter: '[{"name":"categoryId","value":"' + categoryId + '","type":"string"}]'
        };
        var category = me.grid.filter.getComponent('categoryId');
        category.setValue(categoryId);
        me.grid.show();
        me.setTitle(i18n.getKey('userDesign') + '(' + categoryName + ')')
        store.loadPage(1);
    },
    initComponent: function () {
        var me = this;
        me.store = Ext.create('CGP.userdesigncategory.store.UserDesignsStore');
        var controller = Ext.create('CGP.userdesigncategory.controller.Controller');
        me.grid = Ext.create('CGP.common.commoncomp.QueryGrid', {
            hidden: !me.initData,
            gridCfg: {
                editAction: false,
                deleteAction: false,
                store: me.store,
                defaults: {
                    width: 180
                },
                selType: 'rowmodel',
                columns: [
                    {
                        dataIndex: 'id',
                        tdCls: 'vertical-middle',
                        text: i18n.getKey('id'),
                        width: 80
                    },
                    {
                        dataIndex: 'displayName',
                        width: 300,
                        tdCls: 'vertical-middle',
                        text: i18n.getKey('displayName')
                    },

                    {
                        dataIndex: 'name',
                        width: 300,
                        tdCls: 'vertical-middle',
                        text: i18n.getKey('name')
                    },
                    {
                        xtype: 'imagecolumn',
                        width: 120,
                        dataIndex: 'name',
                        tdCls: 'vertical-middle',
                        text: i18n.getKey('image'),
                        buildUrl: function (value, metadata, record) {
                            var imageUrl = imageServer + value;
                            return imageUrl;
                        },
                        buildPreUrl: function (value, metadata, record) {
                            var imageUrl = imageServer + value;
                            return imageUrl;
                        },
                        buildTitle: function (value, metadata, record) {
                            return `${i18n.getKey('check')} < ${value} > 预览图`;
                        },
                    },
                    {
                        dataIndex: 'format',
                        tdCls: 'vertical-middle',
                        text: i18n.getKey('format')
                    },
                    {
                        dataIndex: 'height',
                        tdCls: 'vertical-middle',
                        text: i18n.getKey('height')
                    },
                    {
                        dataIndex: 'width',
                        tdCls: 'vertical-middle',
                        text: i18n.getKey('width')
                    },
                    {
                        dataIndex: 'price',
                        tdCls: 'vertical-middle',
                        text: i18n.getKey('price')
                    },
                    {
                        dataIndex: 'currency',
                        tdCls: 'vertical-middle',
                        text: i18n.getKey('currency') + i18n.getKey('type'),
                        renderer: function (value, metadata, record) {
                            return value.title
                        }
                    }
                ]
            },
            filterCfg: {
                height: 80,
                border: false,
                header: false,
                layout: {
                    type: 'table',
                    columns: 4

                },
                defaults: {
                    width: 280,
                    isLike: false
                },
                items: [
                    {
                        name: 'id',
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('id'),
                        itemId: 'id'
                    },
                    {
                        name: 'displayName',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('displayName'),
                        itemId: 'displayName'
                    },
                    {
                        name: 'name',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('name'),
                        itemId: 'name'
                    },
                    {
                        name: 'format',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('format'),
                        itemId: 'format'
                    },
                    {
                        name: 'categoryId',
                        xtype: 'textfield',
                        hidden: true,
                        itemId: 'categoryId'
                    }
                ]
            }
        });
        me.items = [me.grid];
        me.callParent(arguments);
    }
})
