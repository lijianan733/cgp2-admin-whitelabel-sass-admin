/**
 * @author xiu
 * @date 2025/1/21
 */
Ext.define('CGP.extraorderreportforms.view.CreateGridPage', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.createGridPage',
    block: 'extraorderreportforms',
    editPage: 'edit.html',
    i18nblock: i18n.getKey('extraorderreportforms'),
    initComponent: function () {
        var me = this,
            {type} = me,
            controller = Ext.create('CGP.extraorderreportforms.controller.Controller'),
            defaults = Ext.create('CGP.extraorderreportforms.defaults.ExtraorderreportformsDefaults'),
            {config, test} = defaults,
            {
                columnsText,
                filtersText
            } = config[type],
            columns = controller.getColumnsType(columnsText),
            filters = controller.getFiltersType(filtersText),
            store = Ext.create('CGP.extraorderreportforms.store.ExtraorderreportformsStore', {
                params: {
                    type: type
                }
            });

        me.config = {
            block: me.block,
            tbarCfg: {
                // hidden: true,
                hiddenButtons: ['clear', 'help', 'export', 'import'],
                disabledButtons: ['clear', 'help', 'export', 'import'],
                btnCreate: {
                    iconCls: 'icon_export',
                    text: '拉取数据',
                    width: 100,
                    handler: function (btn) {
                        var url = adminPath + `api/${type}/orders`;
                        controller.asyncEditQuery(url, null, false, function (require, success, response) {
                            if (success) {
                                var responseText = Ext.JSON.decode(response.responseText);
                                if (responseText.success) {
                                    console.log(responseText.data);
                                    store.load();
                                }
                            }
                        }, '拉取成功!')
                    }
                },
                btnDelete: {
                    iconCls: 'icon_refresh',
                    text: '更新数据',
                    itemId: 'resultBtn',
                    width: 100,
                    handler: function (btn) {
                        var url = adminPath + `api/${type}/orders/async`,
                            tools = btn.ownerCt,
                            pullInfo = tools.getComponent('pullInfo'),
                            errorInfo = tools.getComponent('errorInfo');

                        controller.asyncEditQuery(url, null, true, function (require, success, response) {
                            if (success) {
                                var responseText = Ext.JSON.decode(response.responseText);
                                if (responseText.success) {
                                    var urlV2 = adminPath + `api/${type}/orders/progress?progressId=${responseText.data}`;

                                    controller.isCancelled = false;
                                    controller.getAsyncTestResult(
                                        urlV2,
                                        '成功发起请求!',
                                        function (isVisible) {
                                            btn.setDisabled(isVisible);
                                            pullInfo.setVisible(isVisible);
                                        },
                                        function (results) {
                                            Ext.Msg.alert('提示', '数据更新完毕!');
                                            store.load();
                                        },
                                        function (results) {
                                            errorInfo.errorInfo = results;
                                            errorInfo.setVisible(true);
                                        },
                                    )
                                }
                            }
                        }, '更新请求发起成功!')
                    }
                },
                btnConfig: {
                    text: '',
                    disabled: false,
                    hidden: true,
                    xtype: 'fieldcontainer',
                    itemId: 'pullInfo',
                    pullInfo: null,
                    width: 200,
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'progressbar',
                            width: 160,
                            animate: true,
                            itemId: 'progressBar',
                            listeners: {
                                afterrender: function (progressBar) {
                                    progressBar.wait({
                                        interval: 100, // 滚动间隔时间，单位为毫秒
                                        increment: 30, // 每次滚动的增量
                                        text: '更新中...', // 进度条显示的文本
                                        scope: this,
                                        fn: function () {
                                            // 当进度条滚动完成时，重新开始滚动
                                            progressBar.updateProgress(0);
                                            progressBar.wait({
                                                interval: 100,
                                                increment: 30,
                                                text: '更新中...',
                                                scope: this,
                                                fn: arguments.callee // 递归调用自身，实现循环滚动
                                            });
                                        }
                                    });
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: `取消更新请求`,
                            text: JSCreateFont('blue', false, '取消', 12, true, true),
                            itemId: 'cancel',
                            componentCls: "btnOnlyIcon",
                            ui: 'default-toolbar-small',
                            handler: function (btn) {
                                var fieldcontainer = btn.ownerCt,
                                    tools = fieldcontainer.ownerCt,
                                    resultBtn = tools.getComponent('resultBtn');

                                Ext.Msg.confirm('提示', '是否取消当前更新请求？', function (selector) {
                                    if (selector === 'yes') {
                                        fieldcontainer.setVisible(false);
                                        resultBtn.setDisabled(false);
                                        controller.isCancelled = true;
                                    }
                                })
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: `错误信息`,
                            text: JSCreateFont('blue', false, '错误信息', 12, true, true),
                            itemId: 'errorInfo',
                            componentCls: "btnOnlyIcon",
                            ui: 'default-toolbar-small',
                            hidden: true,
                            errorInfo: '',
                            handler: function (btn) {
                                Ext.Msg.alert('错误信息', btn.errorInfo);
                            },
                            listeners: {
                                show: function (btn) {
                                    var fieldcontainer = btn.ownerCt,
                                        tools = fieldcontainer.ownerCt,
                                        resultBtn = tools.getComponent('resultBtn'),
                                        progressBar = tools.getComponent('progressBar'),
                                        cancel = tools.getComponent('cancel');

                                    cancel.setVisible(false);
                                    progressBar.setVisible(false);
                                    resultBtn.setDisabled(false);
                                }
                            }
                        }
                    ],
                }
            },
            gridCfg: {
                store: store,
                // showRowNum: false,
                editAction: false,
                deleteAction: false,
                customPaging: [
                    {value: 25},
                    {value: 100},
                    {value: 500},
                    {value: 1000},
                ],
                selModel: {
                    selType: 'rowmodel'
                },
                viewConfig: {
                    getRowClass: function (record, rowIndex, rowParams, store) {
                        return 'custom-row-class'; // 可以根据条件返回不同的类
                    }
                },
                columns: columns
            },
            filterCfg: {
                clearAction: false,
                searchAction: false,
                getQuery: function () {
                    var querys = [],
                        f = 0,
                        fields,
                        field, val, name, sp;
                    fields = this.form.getFields().items;
                    for (; f < fields.length; f++) {

                        field = fields[f];
                        name = field.name;
                        if (field.diyGetValue) {
                            val = field.diyGetValue();
                        } else {
                            val = field.getValue();
                        }
                        if (field.xtype == 'gridcombo' || field.xtype == 'singlegridcombo') {
                            val = field.getSubmitValue()[0];
                        }
                        if (field.xtype == 'productcategorycombo') {
                            val = field.value ? field.value.toString() : null;
                        }
                        if (!Ext.isEmpty(val)) {
                            var query = {};
                            query.name = name;

                            if (field.xtype == 'datefield') {
                                query.value = val;
                                query.type = 'date';
                            } else if (Ext.isDate(val)) {
                                if (!Ext.isEmpty(field.change)) {
                                    var time = val.getTime();
                                    var resultTime;
                                    resultTime = time + (24 * 60 * 60 * 1000 * field.change);
                                    val = new Date(resultTime);
                                }
                                var values = Ext.Date.format(val, 'Y-m-d H:i:s');
                                query.value = values;
                                query.type = 'date';
                            } else if (Ext.isString(val)) {
                                var values;
                                if (!Ext.isEmpty(field.isExtraParam) && field.isExtraParam == true) {
                                    var extraParamData = {};
                                    if (field.itemId == 'extraParamValue' && !Ext.isEmpty(field.getValue())) {
                                        Ext.each(fields, function (item) {
                                            if (item.itemId == 'extraParamName') {
                                                extraParamData[item.getValue()] = field.getValue();
                                            }
                                        });
                                        query.value = extraParamData;
                                        query.type = 'string';
                                    }

                                } else {
                                    if (!Ext.isEmpty(field.isBoolean) && field.isBoolean == true) {
                                        query.value = val;
                                        query.type = 'boolean';
                                    } else if (!Ext.isEmpty(field.isNumber) && field.isNumber == true) {
                                        //处理[{"name":"includeIds","value":"[111,1212]","type":"number"}]这种情况
                                        query.value = val;
                                        query.type = 'number';
                                    } else {
                                        //includeIds 和excludeIds 不需要对特殊字符进行处理
                                        if (query.name == 'includeIds' || query.name == 'excludeIds' || query.name == 'clazz') {
                                            query.value = val;
                                            query.type = 'string';
                                        } else {
                                            //正则表达式特殊字符转译
                                            values = val.replace(new RegExp('(?=[\\/+*?\\[\\].\(\)|$^])', 'g'), '\\');

                                            if (Ext.isEmpty(field.isLike) || field.isLike == true) {
                                                if (field.isArray) {
                                                    values = values.split(',');
                                                }
                                                values = "%" + values.replace("'", "''") + "%";

                                            } else if (!Ext.isEmpty(field.isLike) && field.isLike === false) {
                                                if (field.isArray) {
                                                    values = values.split(',');
                                                }
                                                query.operator = 'exactMatch';
                                            }
                                            query.value = values;
                                            query.type = 'string';
                                        }
                                    }
                                }
                            } else if (Ext.isNumber(val)) {
                                query.value = val;
                                query.type = "number";
                            } else if (Ext.isBoolean(val)) {
                                query.value = val;
                                query.type = 'boolean';
                            } else if (Ext.isArray(val)) {
                                if (Ext.isEmpty(field.isArray) || field.isArray == false) {
                                    Ext.Array.remove(val, null);
                                    if (!val.length > 0) {
                                        continue;
                                    }
                                    query.value = val.join(',');
                                    query.type = 'string';
                                } else if (!Ext.isEmpty(field.isArray) && field.isArray === true) {
                                    Ext.Array.remove(val, null);
                                    if (!val.length > 0) {
                                        continue;
                                    }
                                    query.value = val;
                                    query.type = 'string';
                                }
                            }
                            querys.push(query);
                        }
                    }
                    for (var i = 0; i < querys.length; i++) {
                        if (Ext.isEmpty(querys[i].value)) {
                            querys.remove(i);
                        }
                    }
                    return querys;
                },
                minHeight: 60,
                items: Ext.Array.merge(filters, [
                    {
                        xtype: 'fieldcontainer',
                        width: 300,
                        layout: 'hbox',
                        itemId: 'fieldContainerv2',
                        style: 'margin-left:60px',
                        items: [
                            {
                                xtype: 'button',
                                text: '查询',
                                width: 100,
                                itemId: 'searchButton',
                                iconCls: 'icon_query',
                                handler: function () {
                                    me.grid.getStore().loadPage(1);
                                },
                            },
                            {
                                xtype: 'button',
                                text: '导出查询数据',
                                width: 120,
                                itemId: 'clearButton',
                                iconCls: 'icon_import',
                                style: 'margin-left:15px',
                                handler: function (btn) {
                                    var filterComp = btn.ownerCt.ownerCt,
                                        queryData = filterComp.getQuery(),
                                        url = adminPath + `api/${type}/orders/export`;

                                    if (queryData?.length) {
                                        url += `?filter=${encodeURIComponent(JSON.stringify(queryData))}`
                                    }

                                    JSDownload(url, `${type} order统计报表`);
                                }
                            }
                        ]
                    }
                ])
            }
        }
        me.callParent();
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
})