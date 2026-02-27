Ext.Loader.syncRequire(['Ext.ux.form.GridField', "CGP.font.model.FontModel"]);
Ext.onReady(function () {

    var controller = Ext.create("CGP.font.controller.Controller");
    var languageGrid = {
        selModel: new Ext.selection.RowModel({
            mode: 'MULTI'
        }),
        store: Ext.create("CGP.font.store.Language"),
        height: 200,
        width: 900,
        columns: [
            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                width: 60,
                sortable: false,
                resizable: false,
                menuDisabled: true,
                items: [
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actionremove',
                        tooltip: 'Remove',
                        handler: function (view, rowIndex, colIndex) {
                            var store = view.getStore();
                            store.removeAt(rowIndex);
                        }
                    }
                ]
            },
            {
                text: i18n.getKey('id'),
                sortable: false,
                dataIndex: 'id',
                width: 80,
                renderer: function (value) {
                    if (value < 0) {
                        return '';
                    } else {
                        return value;
                    }
                }
            },
            {
                text: i18n.getKey('name'),
                sortable: false,
                dataIndex: 'name',
                width: 180,
                renderer: function (value, metadata) {
                    metadata.tdAttr = 'data-qtip ="' + value + '"';
                    return value;
                }
            },
            {
                text: i18n.getKey('locale'),
                dataIndex: 'locale',
                xtype: 'gridcolumn',
                itemId: 'locale',
                sortable: true,
                renderer: function (v) {
                    if (v) {
                        return v.name + '(' + v.code + ')';
                    }
                }
            }, {
                text: i18n.getKey('code'),
                dataIndex: 'code',
                xtype: 'gridcolumn',
                itemId: 'code',
                sortable: true,
                renderer: function (v) {
                    return v.code;
                }
            }
        ],
        tbar: [
            {
                text: i18n.getKey('add'),
                iconCls: 'icon_create',
                handler: function () {
                    var store = this.ownerCt.ownerCt.getStore();
                    var filterData = store.data.items;
                    controller.openLanguageWindow(store, filterData);
                }
            }
        ]

    };

    var page = Ext.widget({
        block: 'attribute',
        xtype: 'uxeditpage',
        tbarCfg: {
            btnCopy: {}
        },
        gridPage: 'main.html',
        formCfg: {
            layout: {
                layout: 'table',
                columns: 1,
                tdAttrs: {
                    style: {
                        'padding-right': '120px'
                    }
                }
            },
            model: 'CGP.font.model.FontModel',
            items: [
                {
                    name: 'fontFamily',
                    allowBlank: false,
                    xtype: 'textfield',
                    regex: /^\S+.*\S+$/,
                    regexText: '值的首尾不能存在空格！',
                    fieldLabel: i18n.getKey('fontFamily'),
                    itemId: 'fontFamily'
                },
                {
                    name: 'displayName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('displayName'),
                    itemId: 'displayName'
                },
                {
                    name: 'wordRegExp',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('wordRegExp'),
                    itemId: 'wordRegExp'
                },
                {
                    xtype: 'checkboxgroup',
                    name: 'fontStyleKeys',
                    fieldLabel: i18n.getKey('supportedStyle'),
                    // Arrange checkboxes into two columns, distributed vertically
                    columns: 2,
                    vertical: true,
                    items: [
                        {boxLabel: '加粗', width: 80, name: 'rb1', inputValue: 'BOLD'},
                        {boxLabel: '斜体', width: 80, name: 'rb2', inputValue: 'ITALIC'},
                        {boxLabel: '下划线', width: 80, name: 'rb3', inputValue: 'UNDERLINE'}
                    ]
                }, {
                    name: 'CGP.font.model.FontModel.languages',
                    xtype: 'gridfield',
                    colspan: 2,
                    gridConfig: languageGrid,
                    fieldLabel: i18n.getKey('language'),
                    itemId: 'language',
                    id: 'language',
                    valueType: 'id'
                }

            ]
        },
        listeners: {}
    });
});
