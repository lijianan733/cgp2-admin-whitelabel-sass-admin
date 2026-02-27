/**
 * 多语言设置编辑页面
 *
 */
Ext.Loader.syncRequire([
    'CGP.multilanguageconfig.store.LanguageCodeStore'
])
Ext.onReady(function () {
    var store = Ext.create('CGP.multilanguageconfig.store.MultiLanguageConfigStore',{
        groupField: 'type',
    });
    var languageCode = Ext.create('CGP.multilanguageconfig.store.LanguageCodeStore');
    // 创建一个GridPage控件
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('resources'),
        block: 'multilanguageconfig',
        editSuffix: '_add',
        // 多语言配置编辑界面
        editPage: 'add.html',
        tbarCfg: {
            btnCreate: {
                handler: function (btn) {
                    var grid = btn.ownerCt.ownerCt.ownerCt.grid;
                    if (!Ext.isEmpty(grid.getStore().getAt(0))) {
                        var item = grid.getStore().getAt(0);
                        //获取当前name下，多语言配置中包含的cultureCode类型（resources接口待新增字段包含cultureCodeId）
                        var name = item.data.name;
                        var type = item.data.type;
                        var resourcesArray = store.data.items;
                        var codeArray = resourcesArray.map(function (item) {
                            return item.data.language.id;
                        });
                        var codeArrayStr = '[' + codeArray.join(',') + ']';
                        var url = path + 'partials/' + 'multilanguageconfig' + '/' + 'add.html' + '?name=' + name + '&codeArrayStr=' + codeArrayStr;
                        var title = i18n.getKey("add") + '_' + i18n.getKey('multilanguage');
                        JSOpen({
                            id: 'multilanguageconfig_add',
                            url: url,
                            title: title,
                            refresh: true
                        });
                        return ;
                    }
                    // 当key对应的多语言配置为空时，直接跳转add页面，传递参数name   name
                    var name = JSGetQueryString('name');
                    var type = JSGetQueryString('type');
                    var url = path + 'partials/' + 'multilanguageconfig' + '/' + 'add.html' + '?name=' + name;
                    var title = i18n.getKey("add") + '_' + i18n.getKey('multilanguage');
                    JSOpen({
                        id: 'multilanguageconfig_add',
                        url: url,
                        title: title,
                        refresh: true
                    });
                }
            }
        },
        gridCfg: {
            store: store,
            frame: false,
            features: [{ftype:'grouping'}],
            columnDefaults: {
                autoSizeColumn: true,
                tdCls: 'vertical-middle'
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    sortable: true
                }, {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    itemId: 'name',
                    width: 250,
                    sortable: true
                }, {
                    text: i18n.getKey('value'),
                    dataIndex: 'value',
                    xtype: 'gridcolumn',
                    width: 450,
                    itemId: 'value',
                    sortable: true
                }, {
                    text: i18n.getKey('type'),
                    dataIndex: 'type',
                    xtype: 'gridcolumn',
                    itemId: 'type',
                    sortable: true
                },
                {
                    text: i18n.getKey('cultureCode'),
                    dataIndex: 'cultureCode',
                    xtype: 'gridcolumn',
                    minWidth: 120,
                    itemId: 'cultureCode',
                    sortable: true
                },
                {
                    text: i18n.getKey('comment'),
                    dataIndex: 'comment',
                    xtype: 'gridcolumn',
                    itemId: 'comment',
                    sortable: true,
                    flex: 1,
                }]
        },
        filterCfg: {
            hidden: true,
            items: [
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                }
            ]
        }
    });
});
