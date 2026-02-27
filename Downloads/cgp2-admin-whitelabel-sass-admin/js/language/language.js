Ext.onReady(function () {
    // 用于下面的资源

    // 初始化资源

    var store = Ext.create('CGP.language.store.LanguageStore');
    var zoneStore = Ext.create('CGP.zone.store.Zone');
    // 创建一个GridPage控件
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('language'),
        block: 'language',
        // 编辑页面
        editPage: 'edit.html',

        gridCfg: {
            // store是指store.js
            store: store,
            frame: false,
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
                    sortable: true
                }, {
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
                },
                {
                    xtype: 'imagecolumn',
                    width: 150,
                    dataIndex: 'image',
                    text: i18n.getKey('languageImgText'),
                    buildUrl: function (value, metadata, record) {
                        return imageServer + value + '/png';
                    },
                    buildPreUrl: function (value, metadata, record) {
                        return imageServer + value + '/64/64/png';
                    },
                    buildTitle: function (value, metadata, record) {
                        return `${i18n.getKey('check')} < ${value} > 预览图`;
                    },
                },
                {
                    text: i18n.getKey('image'),
                    dataIndex: 'image',
                    xtype: 'gridcolumn',
                    minWidth: 120,
                    itemId: 'image',
                    sortable: true,
                    renderer: function (v) {
                        return '<img src="' + url + '" />';
                    }
                }, {
                    text: i18n.getKey('directory'),
                    dataIndex: 'directory',
                    xtype: 'gridcolumn',
                    itemId: 'directory',
                    sortable: true
                }, {
                    text: i18n.getKey('sortOrder'),
                    dataIndex: 'sortOrder',
                    xtype: 'gridcolumn',
                    itemId: 'sortOrder',
                    sortable: true,
                    flex: 1
                }]
        },

        // 查询输入框
        filterCfg: {
            items: [{
                id: 'idSearchField',
                name: 'id',
                xtype: 'numberfield',
                hideTrigger: true,
                allowDecimals: false,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                id: 'nameSearchField',
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }, {
                name: 'locale.id',
                fieldLabel: i18n.getKey('locale'),
                itemId: 'locale',
                xtype: 'gridcombo',
                haveReset: true,
                allowBlank: true,
                multiSelect: false,
                displayField: 'code',
                valueField: 'id',
                labelAlign: 'right',
                editable: false,
                store: zoneStore,
                matchFieldWidth: false,
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setInitialValue([data.id])
                    }
                },
                diyGetValue: function () {
                    var me = this;
                    if (me.getSubmitValue().length > 0) {
                        return {
                            id: me.getSubmitValue()[0],
                            clazz: 'com.qpp.cgp.domain.common.Zone'
                        }
                    }
                    return null;

                },
                gridCfg: {
                    height: 300,
                    width: 500,
                    viewConfig: {
                        enableTextSelection: true
                    },
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            width: 80,
                            dataIndex: 'id'
                        },
                        {
                            text: i18n.getKey('name'),
                            width: 100,
                            dataIndex: 'name'
                        },
                        {
                            text: i18n.getKey('code'),
                            width: 100,
                            dataIndex: 'code'
                        },
                        {
                            text: i18n.getKey('country'),
                            flex: 1,
                            dataIndex: 'country',
                            renderer: function (v) {
                                return v.name;
                            }
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: zoneStore,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyMsg: i18n.getKey('noData')
                    })
                }
            }, {
                id: 'codeSearchField',
                name: 'code.code',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('code'),
                itemId: 'code'
            }]
        }
    });
});
