Ext.Loader.syncRequire([
    'CGP.pagecontentschema.view.DisplayObjectEditForm'
])
Ext.define('CGP.pagecontentschema.controller.Controller', {
    /**
     * 旧的使用json数据直接保存操作
     * @param items
     * @param pagecontentschema
     * @param mask
     */
    savePageContentSchemaByJSON: function (items, pagecontentschema, mask) {
        var me = this, method = "POST", url;
        var data = items[0].getValue();
        var jsonData;
        if (!Ext.isEmpty(data)) {
            try {
                jsonData = JSON.parse(data);
            } catch (e) {
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('illlegal json'));
                mask.hide();// error in the above string (in this case, yes)!
                return;
            }
        }
//		object.promotionId = 1;
        url = adminPath + 'api/pageContentSchemas';
        if (pagecontentschema != null &&
            pagecontentschema.modelName == "CGP.pagecontentschema.model.PageContentSchema"
            && pagecontentschema.getId() != null) {

            jsonData._id = pagecontentschema.get("_id");
            method = "PUT";
            url = url + "/" + jsonData._id;
        }
        jsonData.clazz = 'com.qpp.cgp.domain.bom.PageContentSchema';

        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: jsonData,
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveSuccess'), function () {
                        var id = resp.data._id;
                        var htmlUrl = path + "partials/pagecontentschema/edit.html?id=" + id;
                        JSOpen({
                            id: "pagecontentschema_edit",
                            url: htmlUrl,
                            title: i18n.getKey('edit') + "_" + i18n.getKey('pageContentSchema'),
                            refresh: true
                        });
                    });
                } else {
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            },
            callback: function () {
                mask.hide();
            }
        });
    },

    /**
     * 保存
     * @param items
     * @param pagecontentschema
     * @param mask
     */
    savePageContentSchema: function (data, tab) {
        var me = this;
        var pageContentSchemaData = null;
        var method = "POST";
        var url = adminPath + 'api/pageContentSchemas';
        data.clazz = 'com.qpp.cgp.domain.bom.PageContentSchema';
        if (!Ext.isEmpty(data._id)) {
            url = adminPath + 'api/pageContentSchemas/' + data._id;
            method = 'PUT';
        }
        Ext.Ajax.request({
            url: url,
            method: method,
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    tab.pageContentSchemaData = resp.data;
                    pageContentSchemaData = resp.data;
                    var copyBtn = tab.getDockedItems('toolbar[dock="top"]')[0].getComponent('copyBtn');
                    copyBtn.setDisabled(false);
                    tab.setValue(tab.pageContentSchemaData);
                    if (tab.items.items[1].rendered == true) {
                        tab.items.items[1].items.items[0].deselectRecord = null;
                    }
                    var pageContentSchemaEdit = top.Ext.getCmp('tabs').getComponent('pagecontentschema_edit');
                    pageContentSchemaEdit.setTitle(i18n.getKey('edit') + '_pageContentSchema');
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveSuccess'));

                } else {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            }
        });
        return pageContentSchemaData;
    },

    /**
     * 选择要添加的displayObject的类型
     */
    selectDisplayObjectType: function (treePanel, record) {
        var controller = this;
        var lastWin = Ext.create('Ext.window.Window', {
            title: i18n.getKey('select') + i18n.getKey('type'),
            modal: true,
            constrain: true,
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'

            },
            items: [
                {
                    xtype: 'combo',
                    itemId: 'clazz',
                    name: 'clazz',
                    editable: false,
                    width: 350,
                    margin: 10,
                    labelWidth: 60,
                    allowBlank: false,
                    fieldLabel: i18n.getKey('type'),
                    valueField: 'value',
                    displayField: 'display',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'display'],
                        data: CGP.pagecontentschema.config.Config.displayObjectComponentList
                    })
                }
            ],
            bbar: [
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('nextStep'),
                    iconCls: 'icon_next_step',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var clazzField = win.getComponent('clazz');
                        if (clazzField.isValid()) {
                            win.el.mask('加载中...');
                            treePanel.ownerCt.updateLayout();
                            setTimeout(function () {
                                controller.addDisplayObjectWin(win, clazzField.getValue(), treePanel, record);
                                win.el.unmask();
                            }, 100)
                        }
                    }
                }, {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        win.close();
                    }
                }
            ]

        });
        lastWin.show();

    },
    addDisplayObjectWin: function (lastWin, clazz, treePanel, record) {
        var controller = this;
        var form = null;
        form = {
            xtype: 'displayobjecteditform',
            overflowX: 'hidden',
            overflowY: 'auto',
            clazzReadOnly: true,
            maxHeight: 600,
        }
        var nextStepWin = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            title: i18n.getKey('新建') + i18n.getKey(clazz),
            layout: 'fit',
            items: [
                form
            ],
            bbar: [
                {
                    xtype: 'button',
                    hidden: lastWin ? false : true,
                    text: i18n.getKey('lastStep'),
                    iconCls: 'icon_previous_step',
                    handler: function (btn) {
                        var nextStepWin = btn.ownerCt.ownerCt;
                        nextStepWin.close();
                    }
                }, '->',
                {
                    text: i18n.getKey('ok'),
                    itemId: 'okBtn',
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var nextStepWin = btn.ownerCt.ownerCt;
                        var form = nextStepWin.items.items[0];
                        if (form.isValid()) {
                            var result = form.getValue();
                            //特色处理下container类型,这个数据的items必须存在，没值时为[]
                            if (result.clazz == 'Container') {
                                result.items = [];
                            }
                            var newNode = record.appendChild(result);
                            treePanel.selectPath(newNode.getPath());
                            console.log(result);
                            nextStepWin.close();
                            lastWin ? lastWin.close() : null;
                        }
                    }
                }, {
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        var nextStepWin = btn.ownerCt.ownerCt;
                        nextStepWin.close();
                        lastWin ? lastWin.close() : null;
                    }
                }
            ]
        });
        nextStepWin.show(null, function () {
            this.items.items[0].diySetValue({clazz: clazz, scale: 1});
            this.setLocalXY(null, null);
            this.el.dom.style.transform = 'translateX(-50%) translateY(-50%)';
            this.el.setLeft('50%')
            this.el.setTop('50%')
        });
    },
    /**
     *查看json数据
     */
    checkPageContentSchemaData: function (data, tab) {
        var controller = this;
        var title = i18n.getKey('pageContentSchema') + '(手动编辑JSON数据，可能导致界面报错，请注意输入数据正确性)';
        var winConfig = {
            height: 620,
            showValue: true,
            editable: true,
            readOnly: false,
            isHiddenRawDateForm: true,
            bbar: [
                '->',
                {
                    text: i18n.getKey('ok'),
                    itemId: 'okBtn',
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var newData = win.getValue();
                        var pageContentSchemaData = controller.savePageContentSchema(newData, tab);
                        //保存json数据后刷新
                        if (pageContentSchemaData) {
                            win.close();
                            if (location.search.includes('id')) {//编辑

                            } else {
                                location.href = location.href + '?id=' + pageContentSchemaData._id;
                            }
                        }
                    }
                }, {
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        btn.ownerCt.ownerCt.close();
                    }
                }
            ]
        };
        JSShowJsonDataV2(data, title, null, winConfig);
    },
    /**
     * 清除数据中的null值键值对
     * isClearNullString是否清楚’‘字符
     * excludeKeys 排除，不作处理的字段
     */
    clearNullValueKey: function (data, isClearNullString, excludeKeys) {
        var controller = this;
        for (var i in data) {
            if (Ext.Array.contains(excludeKeys || [], i)) {
                //改字段不作任何处理
            } else {
                var value = data[i];
                if (value == null) {
                    delete data[i];
                } else if (isClearNullString && value === '') {
                    delete data[i];
                } else if ((typeof (value) === 'object')) {
                    controller.clearNullValueKey(value, isClearNullString, excludeKeys)
                }
            }
        }
    },
    /**
     * 复杂树上一个节点，直接会在当前层级下生成一个新的相同节点
     */
    copyNode: function (treePanel, record) {
        var parentNode = record.parentNode;
        treePanel.setLoading(true);
        var buildData = function (treeNode, result) {
            if (treeNode.hasChildNodes() == false) {//叶子节点,没有子节点
                result = Ext.clone(treeNode.raw);
                delete result.children;
            } else {//非叶子节点
                for (var i = 0; i < treeNode.childNodes.length; i++) {
                    var item = treeNode.childNodes[i];
                    var data = Ext.clone(item.raw);
                    data.children = [];
                    result.children.push(buildData(item, data));
                }
            }
            return result;
        };
        setTimeout(function () {
            var newNode = null;
            var data = Ext.clone(record.raw);
            data.children = [];
            newNode = buildData(record, data);
            //批量替换掉旧的_id
            JSObjectEachItem(newNode, function (data, i) {
                if (i == '_id') {
                    data[i] = JSGetCommonKey(false);
                }
            });
            /*        JSObjectEachItem(newNode, function (data, i) {
                        if (data.clazz == 'Container') {
                            if (data.items) {

                            } else {
                                data.items = [];
                            }
                        }
                    })*/
            parentNode.appendChild(newNode);
            console.log(newNode);
            treePanel.setLoading(false);
        }, 100)

    }
});
