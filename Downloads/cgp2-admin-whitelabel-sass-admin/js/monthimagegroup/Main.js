Ext.onReady(function () {
    var controller = Ext.create("CGP.monthimagegroup.controller.Controller");
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('monthImageGroup') ,
        block: 'monthimagegroup',
        editPage: 'edit.html',
        gridCfg: {
            store: Ext.create("CGP.monthimagegroup.store.MonthImageGroupStore"),
            frame: false,
            columnDefaults: {
                tdCls: 'vertical-middle',
                autoSizeColumn: true
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    width: 90,
                    dataIndex: '_id',
                    itemId: 'id',
                },  {
                    text: i18n.getKey('description'),
                    flex:1,
                    dataIndex: 'description',
                    itemId: 'description',
                }
            ]
        },
        filterCfg: {
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },{
                    id: 'description',
                    name: 'description',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description'
                }
            ]
        }
    });
});
