Ext.onReady(function () {

    var page = Ext.create('Ext.ux.ui.GridPage', {
        id: 'page',
        i18nblock: i18n.getKey('multilingualconfig'),
        block: 'multilingualconfig',
        editPage: 'edit.html',
        gridCfg: {
            //store.js
            store: Ext.create("CGP.multilingualconfig.store.LanguageResource"),
            frame: false,
            columnDefaults: {
                tdCls: 'vertical-middle',
                autoSizeColumn: true
            },
            columns: [{
                text: i18n.getKey('id'),
                width: 80,
                dataIndex: '_id',
                itemId: '_id',
                sortable: true
            }, {
                text: i18n.getKey('entityClass'),
                dataIndex: 'entityClass',
                width: 180,
                itemId: 'entityClass',
                renderer: function (value, mateData, record) {
                    var result = value.split('.').pop();
                    return result;
                }
            }, {
                text: i18n.getKey('needMultilingualAttr'),
                dataIndex: 'attributeNames',
                width: 500,
                xtype: 'arraycolumn',
                itemId: 'attributeNames',
                sortable: false,
                lineNumber: 6,
                flex: 1,
                renderer: function (v, record) {
                    return v;
                }
            }]
        },
        filterCfg: {
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                }, {
                    id: 'entityClass',
                    name: 'entityClass',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('entityClass'),
                    itemId: 'entityClass'
                }]
        }
    });
});