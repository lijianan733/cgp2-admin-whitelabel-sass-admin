Ext.syncRequire('CGP.rtattribute.model.Attribute');
Ext.define("CGP.rtattribute.controller.Controller", {
    optionWindow: null, //某属性下的选项列表
    page: null, //属性的编辑页面
    optionId: -1,
    constructor: function (config) {
        var me = this;
        me.callParent(arguments);
    },
    /*    openOptionWindow: function (page, record, edit0rNew) {
            var me = this,
                isEdit = record;
            me.page = page;
            var store = page.form.getComponent("options").getStore();
            var recordCount = store.getCount();//新建时，记录总条数
            me.pageValueType = Ext.getCmp('valueType').getValue();
            if (Ext.isEmpty(record)) {
                record = Ext.create('CGP.rtattribute.model.AttributesOptions', {
                    displayValue: null,
                    name: null,
                    value: null,
                    sortOrder: null
                });
            }
            if (Ext.isEmpty(isEdit)) {
                me.optionWindow = Ext.create("CGP.rtattribute.view.AddOption", {
                    record: record,
                    recordCount: recordCount,
                    controller: me,
                    edit0rNew: edit0rNew,
                    btnFunction: me.creatSave,
                    pageValueType: me.pageValueType
                });
            } else {
                me.optionWindow = Ext.create("CGP.rtattribute.view.AddOption", {
                    record: record,
                    recordCount: recordCount,
                    controller: me,
                    edit0rNew: edit0rNew,
                    btnFunction: me.editSave,
                    pageValueType: me.pageValueType
                });
            }
            me.optionWindow.show();

        },*/
    /**
     *
     * @param data
     * @param recordId
     */
    saveRtAttributeDef: function (data, uxEditPage) {
        var url = adminPath + 'api/rtAttributeDefs/';
        var recordId = uxEditPage.recordId;
        var method = 'POST';
        if (recordId) {
            url = adminPath + 'api/rtAttributeDefs/' + recordId;
            method = 'PUT';
        }
        Ext.Ajax.request({
            url: url,
            method: method,
            jsonData: data,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                uxEditPage.el.unmask();
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                        uxEditPage['recordId'] = responseMessage.data._id;
                        uxEditPage['createOrEdit'] = 'edit';
                        uxEditPage['recordData'] = responseMessage.data;
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                uxEditPage.el.unmask();
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    },
    creatSave: function (record, name, value, sortOrder, displayValue) {
        var me = this;
        var sotre = me.page.form.getComponent("options").getStore();
        record.set("name", name);
        record.set("value", value);
        record.set('displayValue', displayValue);
        record.set("sortOrder", sortOrder);
        sotre.insert(1, record);
        sotre.sort("sortOrder", "ASC");
        me.optionWindow.close()
    },
    editSave: function (record, name, value, sortOrder, displayValue) {
        var me = this;
        var sotre = me.page.form.getComponent("options").getStore();
        record.set("name", name);
        record.set("value", value);
        record.set("sortOrder", sortOrder);
        record.set('displayValue', displayValue);
        if (me.page.form.getComponent("valueDefault1") && me.page.form.getComponent('valueDefault')) {
            me.page.form.getComponent("valueDefault1").setValue("");
            me.page.form.getComponent('valueDefault').setValue("")
        }
        sotre.sort("sortOrder", "ASC");
        me.optionWindow.close();
    },
    changeselectType: function (combo, newValue, oldValue, optionGrid) {
        var me = this;
        var p = combo.ownerCt.ownerCt;
        var options = combo.ownerCt.getComponent('options');
        if (newValue == 'NON') { //Ext.Array.contains()检查数组中是否包含给定元素
            if (!Ext.isEmpty(options) && options.isVisible()) {
                options.setDisabled(true);
                options.setVisible(false);
                options.getGrid().setVisible(false);
            }
        } else {
            //新建时
            if (Ext.isEmpty(options)) {
                var options = Ext.create("Ext.ux.form.GridField", {
                    name: 'CGP.rtattribute.model.Attribute.options',
                    xtype: 'gridfield',
                    gridConfig: optionGrid,
                    fieldLabel: i18n.getKey('options'),
                    itemId: 'options',
                    id: 'options'
                });
                p.form.add(options);
                p.form.form._configData.push({
                    data: {
                        configuration: options.initialConfig,
                        visible: options.isVisible()
                    }
                });
            } else if (!Ext.isEmpty(options) && !options.isVisible()) {
                options.setDisabled(false);
                options.setVisible(true);
                options.getGrid().setVisible(true);
            }
        }

    },

    /**
     * 添加预定义option
     * @param grid
     */
    advanceOptionWind: function (grid) {
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('add') + i18n.getKey('advance') + i18n.getKey('options'),
            layout: 'fit',
            modal: true,
            items: [
                Ext.create('CGP.rtoption.view.RtOptionGrid', {
                    selecteds: grid.store
                })
            ],
            bbar: [
                '->',
                {
                    itemId: 'btnSave',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_save',
                    handler: function (confirmBtn) {
                        var wind = confirmBtn.ownerCt.ownerCt;
                        var selects = wind.down('grid').getSelectionModel().getSelection();
                        if (selects.length < 1) {
                            Ext.Msg.alert(i18n.getKey('infor'), '至少选择一条数据！');
                            return false;
                        }

                        var index = 0, existeName = '';
                        //获取最大sortOrder
                        if (grid.getStore().max('sortOrder'))
                            index = grid.getStore().max('sortOrder') + 1;
                        //把已选数据插入到Grid中
                        for (var i = 0; i < selects.length; i++) {
                            var item = selects[i].data;
                            item['sortOrder']=index;
                            item['id']= item['id'].toString();
                            //同名option过滤
                            if (grid.getStore().findExact("name", item['name']) >= 0) {
                                existeName += item['name'] + ' ;';
                                continue;
                            }
                            grid.getStore().add(item);
                            index++;
                        }
                        if (existeName) {
                            Ext.Msg.alert('提示', '以下rtOption名称已存在不能重复添加！\n ' + existeName);
                        }
                        wind.close();
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    handler: function () {
                        this.ownerCt.ownerCt.close();
                    }
                }
            ]
        }).show();
    },

    addTagOption: function (grid) {
        var me = this;
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('add') + i18n.getKey('tag') + i18n.getKey('options'),
            layout: 'fit',
            modal: true,
            items: [
                {
                    xtype: 'form',
                    itemId: 'tageOptionForm',
                    padding: '10',
                    border: 0,
                    defaults: {
                        margin: 5,
                        width: 380,
                        labelWidth: 100,
                        allowBlank: false,
                        labelAlign: 'right',
                    },
                    items: [
                        {
                            xtype: 'combo',
                            itemId: 'tagId',
                            fieldLabel: i18n.getKey('tag'),
                            displayField: 'displayName',
                            valueField: 'id',
                            allowBlank: false,
                            store: Ext.create('CGP.rtoption.store.RtOptionTag')
                        }
                    ]
                }
            ],
            bbar: [
                '->',
                {
                    itemId: 'btnSave',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_save',
                    handler: function (confirmBtn) {
                        var wind = confirmBtn.ownerCt.ownerCt;
                        var combTag = wind.down('form').getComponent('tagId');
                        if (!combTag.isValid()) {
                            return false;
                        }
                        var url = adminPath + 'api/rtoptions', method = 'GET';
                        var successCallBack = function (tagOptions) {
                            if (tagOptions.length < 1) {
                                Ext.Msg.alert(i18n.getKey('infor'), '无Option数据！');
                                return false;
                            }
                            var index = 0, existeName = '';
                            //获取最大sortOrder
                            if (grid.getStore().max('sortOrder'))
                                index = grid.getStore().max('sortOrder') + 1;
                            //把已选数据加入到Grid中
                            Ext.Array.each(tagOptions, function (item) {
                                var existRecord = grid.store.findRecord('id', item.id.toString());
                                if (existRecord) {
                                    // Ext.Array.splice(grid.store.proxy.data,indexRecord,1,item);
                                    existRecord.set('displayValue', item['displayValue']);
                                    existRecord.set('name', item['name']);
                                    existRecord.set('value', item['value']);
                                } else {
                                    if (grid.store.findExact('name', item.name) >= 0) {
                                        existeName = item.name + ' ;';
                                    } else {
                                        item['sortOrder'] = index;
                                        item['id'] = item.id.toString();
                                        grid.getStore().add(item);
                                        // grid.getStore().proxy.data.push(item);
                                        index++;
                                    }
                                }
                            });
                            if (existeName) {
                                Ext.Msg.alert('提示', '以下rtOption名称已存在不能重复添加！\n ' + existeName);
                            }
                            wind.close();
                        };
                        Ext.Ajax.request({
                            method: method,
                            async: true,
                            url: url,
                            params: {
                                page: 1,
                                start: 0,
                                limit: 25,
                                sort: '[{"property":"_id","direction":"DESC"}]',
                                filter: '[{"name":"tag.id","value":' + combTag.getValue() + ',"type":"number"}]'
                            },
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            success: function (res) {
                                var responseMessage = Ext.JSON.decode(res.responseText);
                                var data = responseMessage.data?.content;
                                if (responseMessage.success) {
                                    if (!Ext.isEmpty(successCallBack)) {
                                        successCallBack(data);
                                    }
                                } else {

                                    Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message);
                                    return;
                                }
                            },
                            failure: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                return;
                            }
                        });
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    handler: function () {
                        this.ownerCt.ownerCt.close();
                    }
                }
            ]
        }).show();
    },
    /**
     * 添加自定义option
     * @param grid
     */
    customOptionWind: function (grid) {
        grid.beforeOpenEditWindowHandler ? grid.beforeOpenEditWindowHandler() : null;
        var currField = grid.gridField;
        currField.beforeOpenEditWindowHandler ? currField.beforeOpenEditWindowHandler() : null;
        var win = Ext.create('GridFieldWithCRUD.localWindow', {
            createOrEdit: 'create',
            gridField: currField,
            outGrid: grid,
            isReadOnly: currField.readOnly,
            resetHandler: currField.resetHandler,
            data: null,
            winTitle: currField.winTitle,
            saveHandler: currField.saveHandler,
            setValueHandler: currField.setValueHandler,
            formItems: currField.formItems,
            formConfig: currField.formConfig,
        });
        win.show();
    }
});
