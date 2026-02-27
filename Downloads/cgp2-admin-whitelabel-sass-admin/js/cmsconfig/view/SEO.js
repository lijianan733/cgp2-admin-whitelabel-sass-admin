/**
 * @Description:
 * @author nan
 * @date 2022/4/28
 */
Ext.define('CGP.cmsconfig.view.SEO', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.seo',
    title: i18n.getKey('SEO'),
    itemId: 'seoConfig',
    isValidForItems: true,
    defaults: {
        width: 600,
        margin: '5 25 5 25'
    },
    layout: {
        type: 'table',
        columns: 2
    },
    diyGetValue: function () {
        var me = this;
        if (me.rendered) {
            return me.getValue();
        } else {
            return me.data;
        }
    },
    diySetValue: function (data) {
        var me = this;
        me.data = {
            metaKeywords: data.metaKeywords,
            metaDescription: data.metaDescription,
            metaRobots: data.metaRobots,
            metaCharset: data.metaCharset,
            metas: data.metas
        };
        me.setValue(me.data);
    },
    isValid: function () {
        var me = this;
        this.msgPanel.hide();
        if (me.rendered) {
            if (this.isValidForItems == true) {//以form.items.items为遍历
                var isValid = true,
                    errors = {};
                this.items.items.forEach(function (f) {
                    if (!f.isValid()) {
                        var errorInfo = f.getErrors();
                        if (Ext.isObject(errorInfo) && !Ext.Object.isEmpty(errorInfo)) {//处理uxfieldContainer的错误信息
                            errors = Ext.Object.merge(errors, errorInfo);
                        } else {
                            errors[f.getFieldLabel()] = errorInfo;
                        }
                        isValid = false;

                    }
                });
                isValid ? null : this.showErrors(errors);
                return isValid;
            } else {//以form.getFields为遍历
                var isValid = this.callParent(arguments),
                    errors = {};
                if (!isValid) {
                    this.form.getFields().each(function (f) {
                        if (!f.isValid()) {
                            errors[f.getFieldLabel()] = f.getErrors();
                        }
                    });
                }
                isValid ? null : this.showErrors(errors);
                return isValid;
            }
        } else {
            return !Ext.isEmpty(me.data);
        }
    },
    initComponent: function () {
        var me = this;

        var metaDataStore = Ext.create('Ext.data.Store', {
            fields: [
                'property',
                'name',
                'content',
                'charset',
                'httpEquiv'
            ],
            data: [],
            proxy: {
                type: 'pagingmemory'
            }
        });
        me.items = [
            {
                xtype: 'multicombobox',
                itemId: 'metaRobots',
                name: 'metaRobots',
                editable: false,
                multiSelect: true,
                width: 300,
                displayField: 'key',
                valueField: 'value',
                allowBlank: false,
                fieldLabel: i18n.getKey('metaRobots'),
                store: {
                    xtype: 'store',
                    fields: ['key', 'value'],
                    data: [
                        {
                            'key': 'index',
                            'value': 'index'
                        },
                        {
                            'key': 'noindex',
                            'value': 'noindex'
                        },
                        {
                            'key': 'follow',
                            'value': 'follow'
                        },
                        {
                            'key': 'nofollow',
                            'value': 'nofollow'
                        },
                        {
                            'key': 'all',
                            'value': 'all'
                        },
                        {
                            'key': 'none',
                            'value': 'none'
                        },
                        {
                            'key': 'noarchive',
                            'value': 'noarchive'
                        },
                        {
                            'key': 'nosnippet',
                            'value': 'nosnippet'
                        },
                        {
                            'key': 'noimageindex',
                            'value': 'noimageindex'
                        },
                        {
                            'key': 'nocache',
                            'value': 'nocache'
                        }
                    ]
                },
                diyGetValue: function () {
                    var me = this;
                    return me.getValue().toString();
                },
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setValue(data.split(','));
                    }
                }
            },
            {
                xtype: 'textfield',
                itemId: 'metaCharset',
                name: 'metaCharset',
                width: 300,
                allowBlank: false,
                value: 'UTF-8',
                fieldLabel: i18n.getKey('metaCharset')
            },
            {
                xtype: 'arraydatafield',
                itemId: 'metaKeywords',
                name: 'metaKeywords',
                resultType: 'String',
                width: 650,
                allowBlank: false,
                colspan: 2,
                fieldLabel: i18n.getKey('metaKeywords'),
                diyInputComponent: {
                    xtype: 'uxtextarea',
                    margin: '5 25',
                    width: 450,
                    height: 150,
                    msgTarget: 'side',
                    toolbarConfig: {
                        items: [
                            {
                                xtype: 'button',
                                text: '转换特殊字符',
                                handler: function (btn) {
                                    var uxtextarea = btn.ownerCt.ownerCt;
                                    var oldStr = uxtextarea.getValue();
                                    var newStr = JSHtmlEnCode(oldStr);
                                    uxtextarea.setValue(newStr);

                                }
                            }
                        ]
                    },
                    textareaConfig: {
                        vtype: 'forbidSpecialChars'
                    }

                }
            },
            {
                xtype: 'uxtextarea',
                itemId: 'metaDescription',
                name: 'metaDescription',
                width: 650,
                allowBlank: false,
                height: 80,
                colspan: 2,
                vtype: 'forbidSpecialChars',
                toolbarConfig: {
                    items: [
                        {
                            xtype: 'button',
                            text: '转换特殊字符',
                            handler: function (btn) {
                                var uxtextarea = btn.ownerCt.ownerCt;
                                var oldStr = uxtextarea.getValue();
                                var newStr = JSHtmlEnCode(oldStr);
                                uxtextarea.setValue(newStr);
                            }
                        }
                    ]
                },
                fieldLabel: i18n.getKey('metaDescription')
            },
            {
                xtype: 'gridfieldextendcontainer',
                itemId: 'metas',
                name: 'metas',
                width: 650,
                colspan: 2,
                fieldLabel: i18n.getKey('metas'),
                gridConfig: {
                    store: metaDataStore,
                    minHeight: 150,
                    width: 550,
                    maxHeight: 350,
                    viewConfig: {
                        enableTextSelection: true
                    },
                    tbar: {
                        items: [
                            {
                                xtype: 'splitbutton',
                                iconCls: 'icon_add',
                                text: i18n.getKey('add'),
                                menu: [{
                                    text: '谷歌SEO',
                                    handler: function (btn) {
                                        var grid = btn.ownerCt.ownerButton.ownerCt.ownerCt;
                                        var win = Ext.create('CGP.cmsconfig.view.BarthAddSEOWin', {
                                            outGrid: grid
                                        });
                                        win.show();
                                    }
                                }, {
                                    text: '自定义SEO',
                                    handler: function (btn) {
                                        var grid = btn.ownerCt.ownerButton.ownerCt.ownerCt;
                                        var win = Ext.create('CGP.cmsconfig.view.AddSEOWin', {
                                            outGrid: grid
                                        });
                                        win.show();
                                    }
                                }],
                                handler: function (btn) {
                                    var grid = btn.ownerCt.ownerCt;
                                    var win = Ext.create('CGP.cmsconfig.view.AddSEOWin', {
                                        outGrid: grid
                                    });
                                    win.show();
                                }
                            }
                        ]
                    },
                    columns: [
                        {
                            xtype: 'rownumberer'
                        },
                        {
                            xtype: 'actioncolumn',
                            width: 50,
                            items: [
                                {
                                    iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                                    tooltip: 'Edit',
                                    handler: function (grid, rowIndex, colIndex, a, b, record) {
                                        var win = Ext.create('CGP.cmsconfig.view.AddSEOWin', {
                                            outGrid: grid,
                                            record: record
                                        });
                                        win.show();
                                    }
                                },
                                {
                                    iconCls: 'icon_remove icon_margin',
                                    tooltip: 'Delete',
                                    handler: function (view, rowIndex, colIndex, a, b, record) {
                                        Ext.Msg.confirm('提示', '确定删除？', function (selector) {
                                            if (selector == 'yes') {
                                                var store = view.getStore();
                                                store.removeAt(rowIndex);
                                                if (store.proxy.data) {//处理本地数据
                                                    store.proxy.data.splice(rowIndex, 1);
                                                }
                                            }
                                        });
                                    }
                                }
                            ]
                        },
                        {
                            text: 'meta',
                            dataIndex: 'sku',
                            flex: 1,
                            xtype: 'componentcolumn',
                            renderer: function (value, metaData, record) {
                                var value = record.getData();
                                var keyValue = null;
                                var keyName = null;
                                var content = record.get('content');
                                if (value.name) {
                                    keyName = 'name';
                                    keyValue = value.name;
                                } else if (value.property) {
                                    keyName = 'property';
                                    keyValue = value.property;
                                } else if (value.httpEquiv) {
                                    keyName = 'httpEquiv';
                                    keyValue = value.httpEquiv;
                                }

                                var str = `<meta ${keyName}="${(keyValue)}" content="${(content)}">`;
                                return {
                                    xtype: 'textarea',
                                    readOnly: true,
                                    grow: true,
                                    value: str
                                }
                            }
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {//底端的分页栏
                        store: metaDataStore,
                        emptyMsg: i18n.getKey('noData')
                    })
                }
            }
        ]
        me.callParent(arguments);
    }
}, function () {
    window.JSHtmlEnCode = function (str) {
        var s = str;
        s = s.replace(/"/g, "&quot;");
        s = s.replace(/'/g, "&#39;");
        s = s.replace(/\\n/g, "<br>");
        return s;
    }
    window.JSHtmlDeCode = function (text) {
        //1.首先动态创建一个容器标签元素，如DIV
        var temp = document.createElement("div");
        //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
        temp.innerHTML = text;
        //3.最后返回这个元素的innerText或者textContent，即得到经过HTML解码的字符串了。
        var output = temp.innerText || temp.textContent;
        temp = null;
        return output;
    }
    /**
     * 判断给定数据是否存在特殊字符 ‘ “
     */
    window.JSIsExistSpecialChars = function (str = '') {
        var isValid = false;
        if (str.length == 0) return isValid;
        if (/['"\n]/g.test(str)) {
            isValid = true;
        }
        return isValid;
    }
    Ext.apply(Ext.form.field.VTypes, {
        forbidSpecialChars: function (value, field) {
            //处理转义后的字符串
            var old = JSHtmlDeCode(value);
            if (old == value) {//没有转义
                return !JSIsExistSpecialChars(value);
            } else {//有转义了，转义了的字符不参与判断
                //
                value = value.replace(/&#039;|&#39;|&quot;|<br>/g, "");
                return !JSIsExistSpecialChars(value);
            }
        },
        forbidSpecialCharsText: '不允许有’(单引号) ”(双引号)\\n(换行符)等特殊字符'

    })
})