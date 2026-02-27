/**
 * Created by shirley on 2021/08/12
 * 多语言配置添加页面
 *
 */
Ext.Loader.syncRequire([
    'CGP.multilanguageconfig.store.MultiLanguageConfigStore',
    'CGP.multilanguageconfig.store.LanguageCodeStore'
])
Ext.onReady(function () {
    var multiLanguageName = Ext.create('CGP.multilanguageconfig.store.MultiLanguageConfigStore');
    var languageCode = Ext.create('CGP.multilanguageconfig.store.LanguageCodeStore');
    //初始化cultureCode过滤数据参数
    var cultureFilterData = JSGetQueryString('codeArrayStr') || null;
    var page = Ext.widget({
        block: 'multilanguageconfig',
        xtype: 'uxeditpage',
        tbarCfg: {
            //隐藏无用按钮
            btnCreate: {
                hidden: true
            },
            sepEdit: {
                hidden: true
            },
            btnCopy: {
                hidden: true
            },
            btnGrid: {
                hidden: true
            },
            sepData: {
                hidden: true
            },
            btnConfig: {
                hidden: true
            },
            btnHelp: {
                hidden: true
            },
            //重新保存按钮单击事件
            btnSave: {
                handler: function (btn) {
                    btn.ownerCt.ownerCt.form.submitForm({
                        callback: function (data, operation, success) {
                            if (success) {
                                // buttonCreate
                                btn.ownerCt.items.items[0].enable();
                                // buttonCopy
                                btn.ownerCt.items.items[1].enable();
                                var url = path + 'partials/' + 'multilanguageconfig' + '/' + 'edit.html' + '?name=' + data.data.name;
                                var title = i18n.getKey("edit") + '_' + i18n.getKey('multilanguage') + '(' + data.data.name + ')';
                                JSOpen({
                                    id: 'multilanguageconfig_edit',
                                    url: url,
                                    title: title,
                                    refresh: true
                                });
                            }
                        }
                    });
                }
            }
        },
        formCfg: {
            model: 'CGP.multilanguageconfig.model.MultiLanguageConfigModel',
            remoteCfg: false,
            columnCount: 2,
            items: [
                {
                    name: 'name',
                    xtype: 'gridcombo',
                    fieldLabel: i18n.getKey('name'),
                    allowBlank: false,
                    itemId: 'name',
                    valueField: 'name',
                    displayField: 'name',
                    //关闭手动输入时的自动查询功能
                    autoQuery: false,
                    emptyText: "添加的多语言key",
                    matchFieldWidth: false,
                    multiSelect: false,
                    autoScroll: true,
                    store: multiLanguageName,
                    filterCfg: {
                        layout: {
                            type: 'column'
                        },
                        defaults: {
                            width: 170,
                            isLike: false,
                            padding: 2
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('name'),
                                name: 'name',
                                itemId: 'name',
                                labelWidth: 40
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('type'),
                                name: 'type',
                                itemId: 'type',
                                labelWidth: 40
                            }
                        ]
                    },
                    gridCfg: {
                        store: multiLanguageName,
                        height: 300,
                        width: 400,
                        viewConfig: {
                            enableTextSelection: true
                        },
                        autoScroll: true,
                        columns: [
                            {
                                xtype: 'rownumberer',
                                width: 50
                            },
                            {
                                text: i18n.getKey('name'),
                                flex: 1,
                                dataIndex: 'name',
                                renderer: function (value, metaData, record, rowIndex) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('type'),
                                flex: 1,
                                dataIndex: 'type',
                                renderer: function (value, metaData, record, rowIndex) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value;
                                }
                            }
                        ],
                        listeners: {
                            // TODO 当元素在输入框中手动输入时，无法正确判断type类型(暂时不考虑手动输入name进行数据请求的情况)
                            select: function (combo, records, eOpts) {
                                var name = records.data.name;
                                var type = records.data.type;
                                //   修改type组件，添加value，并修改为只读状态
                                var typeComp = Ext.getCmp('type');
                                typeComp.setValue(type);
                                typeComp.setReadOnly(true);
                                typeComp.setFieldStyle({
                                    backgroundColor: '#f5f5f5',
                                    color: 'silver',
                                    borderColor: '#f5f5f5'
                                });
                                var filterData = Ext.JSON.encode([{
                                    "name": "name",
                                    "operator": "exactMatch",
                                    "value": name,
                                    "type": "string"
                                }, {
                                    "name": "type",
                                    "operator": "exactMatch",
                                    "value": type,
                                    "type": "string"
                                }]);
                                //根据name和type获取多语言配置数据，更新cultureCode数据过滤参数cultureFilterData
                                Ext.Ajax.request({
                                    //TODO limit参数待完善
                                    url: encodeURI(adminPath + 'api/resources?page=1&start=0&limit=1000&filter=' + filterData),
                                    method: 'GET',
                                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                    async: false,
                                    success: function (rep) {
                                        var response = Ext.JSON.decode(rep.responseText);
                                        if (response.success) {
                                            var multiLanguageData = response.data.content;
                                            cultureFilterData = multiLanguageData.map(function (item) {
                                                return item.language.id;
                                            });
                                        } else {
                                            Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                                        }
                                    },
                                    failure: function (resp) {
                                        var response = Ext.JSON.decode(resp.responseText);
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                    }
                                });
                            }
                        },
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: multiLanguageName,
                            emptyMsg: i18n.getKey('noData')
                        })
                    },
                    //  添加name组件状态判断，可编辑状态（main页面点击‘新建’直接跳转），只读状态（edit页面点击‘新建’直接跳转）
                    readOnly: JSGetQueryString('name') ? true : false,
                    value: {name: JSGetQueryString('name')},
                    // 添加name只读（edit页面点击“新建”）
                    fieldStyle: function () {
                        if (JSGetQueryString('name')) {
                            return {
                                backgroundColor: '#f5f5f5',
                                color: 'silver',
                                borderColor: '#f5f5f5'
                            };
                        }
                    }(),
                    //  只读状态（edit页面点击‘新建’或'编辑'直接跳转）
                    diySetValue: function (data) {
                        var me = this;
                        if (data) {
                            me.setValue({
                                name: data
                            });
                            me.setReadOnly(true);
                            me.setFieldStyle({
                                backgroundColor: '#f5f5f5',
                                color: 'silver',
                                borderColor: '#f5f5f5'
                            });
                        }
                    },
                    diyGetValue: function () {
                        var me = this;
                        var data = me.getRawValue();
                        return data;
                    }
                },
                {
                    name: 'value',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('value'),
                    allowBlank: false,
                    itemId: 'value',
                    emptyText: "添加的多语言value"
                },
                {
                    name: 'type',
                    id: 'type',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('type'),
                    allowBlank: false,
                    editable: false,
                    itemId: 'type',
                    valueField: 'type',
                    displayField: 'type',
                    tipInfo: 'ComposingConfig:排版文字使用的多语言信息<br>' +
                        'BuilderConfig:Builder界面中使用的多语言信息<br>' +
                        'CaptionRes:管理后台界面中使用的多语言信息<br>',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'type'
                        ],
                        data: [
                            {
                                type: 'CaptionRes'
                            },
                            {
                                type: 'BuilderConfig'
                            },
                            {
                                type: 'ComposingConfig'
                            },
                            {
                                type: 'TreeRes'
                            },
                            {
                                type: 'MessageRes'
                            }
                        ]
                    }),
                    value: 'BuilderConfig',
                    readOnly: JSGetQueryString('type') ? true : false,
                    fieldStyle: function () {
                        if (JSGetQueryString('type')) {
                            return {
                                backgroundColor: '#f5f5f5',
                                color: 'silver',
                                borderColor: '#f5f5f5'
                            };
                        }
                    }(),
                    diySetValue: function (data) {
                        var me = this;
                        if (data) {
                            me.setValue(data);
                            me.setReadOnly(true);
                            me.setFieldStyle({
                                backgroundColor: '#f5f5f5',
                                color: 'silver',
                                borderColor: '#f5f5f5'
                            });
                        }
                    },
                },
                {
                    name: 'cultureCode',
                    id: 'cultureCode',
                    xtype: 'gridcombo',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('cultureCode'),
                    itemId: 'cultureCode',
                    editable: false,
                    isLike: false,
                    valueField: 'codeValue',
                    displayField: 'codeValue',
                    matchFieldWidth: false,
                    multiSelect: false,
                    autoScroll: true,
                    value: {codeValue: 'zh'},
                    diySetValue: function (data) {
                        var me = this;
                        if (data) {
                            me.setValue({
                                codeValue: data
                            });
                            me.setReadOnly(true);
                            me.setFieldStyle({
                                backgroundColor: '#f5f5f5',
                                color: 'silver',
                                borderColor: '#f5f5f5'
                            });
                        }
                    },
                    diyGetValue: function (data) {
                        var me = this;
                        var data = me.getDisplayValue();
                        return data;
                    },
                    onTriggerClick: function () {
                        var me = this;
                        if (!me.readOnly && !me.disabled) {
                            if (me.isExpanded) {
                                me.collapse();
                            } else {
                                me.onFocus({});
                                if (me.triggerAction === 'all') {
                                    me.doQuery(me.allQuery, true);
                                } else {
                                    me.doQuery(me.getRawValue());
                                }
                            }
                            me.inputEl.focus();
                        }
                        //  根据culture请去更新languageCode数据
                        if (cultureFilterData) {
                            var filterData = Ext.JSON.encode([{
                                "name": "excludeIds",
                                "value": cultureFilterData,
                                "type": "number"
                            }]);
                            languageCode.proxy.url = encodeURI(adminPath + 'api/languages?page=1&start=0&limit=25&filter=' + filterData);
                            languageCode.load();
                        }
                    },
                    store: languageCode,
                    filterCfg: {
                        layout: {
                            type: 'column'
                        },
                        defaults: {
                            width: 170,
                            isLike: false,
                            padding: 2
                        },
                        items: [
                            {
                                xtype: 'numberfield',
                                fieldLabel: i18n.getKey('id'),
                                name: 'id',
                                isLike: false,
                                itemId: 'id',
                                labelWidth: 40,
                                hideTrigger: true
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('code'),
                                name: 'code.code',
                                itemId: 'code',
                                labelWidth: 40
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('name'),
                                name: 'name',
                                itemId: 'name',
                                labelWidth: 40
                            }
                        ]
                    },
                    gridCfg: {
                        store: languageCode,
                        height: 300,
                        width: 400,
                        viewConfig: {
                            enableTextSelection: true
                        },
                        autoScroll: true,
                        columns: [
                            {
                                xtype: 'rownumberer',
                                width: 50
                            },
                            {
                                text: i18n.getKey('id'),
                                width: 80,
                                dataIndex: 'id',
                                renderer: function (value, metaData) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('code'),
                                flex: 1,
                                dataIndex: 'codeValue',
                                renderer: function (value, metaData, record, rowIndex) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('name'),
                                flex: 1,
                                dataIndex: 'name',
                                renderer: function (value, metaData, record, rowIndex) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value;
                                }
                            }
                        ],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: languageCode,
                            emptyMsg: i18n.getKey('noData')
                        })
                    }
                },
                {
                    name: 'active',
                    xtype: 'checkbox',
                    fieldLabel: i18n.getKey('active'),
                    hidden: true,
                    checked: true,
                    itemId: 'active'
                },
                //comment:备注信息
                {
                    name: 'comment',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('comment'),
                    allowBlank: true,
                    itemId: 'comment'
                }
            ]
        }
    });
});