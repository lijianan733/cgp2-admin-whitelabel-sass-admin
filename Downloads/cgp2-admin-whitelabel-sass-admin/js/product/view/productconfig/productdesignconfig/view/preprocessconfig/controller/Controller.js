/**
 * Created by nan on 2020/2/20.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.controller.Controller', {
    /**
     * 保存操作
     */
    savePreProcessConfig: function (data, createOrEdit, tab) {
        var controller = this;
        tab.el.mask('保存中...');
        //如果是新建的话，要在创建template后，在修改mvt
        var url = adminPath + 'api/pagecontentpreprocess';
        var method = 'POST';
        if (createOrEdit == 'edit') {
            url = adminPath + 'api/pagecontentpreprocess/' + tab.recordId;
            method = 'PUT';
        }

        controller.clearNullValueKey(data, true, ['printFile', 'imageName', 'text', 'color']);
        Ext.Ajax.request({
            url: url,
            method: method,
            jsonData: data,
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    tab.el.unmask();
                    tab.createOrEdit = 'edit';
                    tab.recordId = responseMessage.data._id;
                    tab.setValue(responseMessage.data);
                    var editPreProcessConfig = window.parent.Ext.getCmp('builderConfigTab').getComponent('editPreProcessConfig');
                    editPreProcessConfig.setTitle(i18n.getKey('edit') + i18n.getKey('preProcessConfig'));
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                    });
                } else {
                    tab.el.unmask();
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                tab.el.unmask();
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    },
    editOperator: function (createOrEdit, operator) {
        if (createOrEdit == 'edit') {
            var operatorId = '';
            for (var i in operator.getValue()) {
                operatorId = i;
            }
            JSOpen({
                id: 'operator' + '_edit',
                url: path + "partials/pcoperatormanage/bpmn.html?clazzId=" + operatorId + '&createOrEdit=edit',
                title: i18n.getKey('operatorConfig') + i18n.getKey('edit') + '(' + operatorId + ')',
                refresh: true
            });
        } else {
            Ext.Ajax.request({
                url: adminPath + 'api/operatorcontroller',
                method: 'POST',
                jsonData: {
                    "clazz": "com.qpp.cgp.domain.preprocess.operator.SourceOperatorConfig",
                    "sourceType": "target"
                },
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        var operatorId = responseMessage.data._id;
                        operator.setInitialValue([operatorId]);
                        JSOpen({
                            id: 'operator' + '_edit',
                            url: path + "partials/pcoperatormanage/bpmn.html?clazzId=" + operatorId + '&createOrEdit=create',
                            title: i18n.getKey('operatorConfig') + i18n.getKey('create') + '(' + operatorId + ')',
                            refresh: true
                        });
                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            });
        }
    },
    /**
     *查看json数据
     */
    checkPCPreProcessConfigData: function (data, tab, isLock) {
        var controller = this;
        JSShowJsonDataV2(data, i18n.getKey('PC预处理配置') + '(手动编辑JSON数据,可能导致界面报错,按照类图属性添加,请注意输入数据正确性)', null, {
            width: 800,
            height: 700,
            editable: isLock ? false : true,
            readOnly: isLock ? true : false,
            bbar: {
                hidden: isLock,
                items: [
                    '->',
                    {
                        text: i18n.getKey('ok'),
                        itemId: 'okBtn',
                        iconCls: 'icon_agree',
                        handler: function (btn) {
                            var win = btn.ownerCt.ownerCt;
                            var data = win.getValue();
                            controller.savePreProcessConfig(data, data._id ? 'edit' : 'create', tab);
                            win.close();
                        }
                    }, {
                        text: i18n.getKey('cancel'),
                        iconCls: 'icon_cancel',
                        handler: function (btn) {
                            btn.ownerCt.ownerCt.close();
                        }
                    }
                ]

            }
        });
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
                console.log(i);
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
     * MVT选择窗口
     * @param grid
     * @param recd
     */
    selectMVT: function (grid, recd) {
        Ext.create("Ext.window.Window", {
            itemId: "addMVTWindow",
            title: i18n.getKey('MVT'),
            modal: true,
            width: 700,
            height: 450,
            layout: 'fit',
            items: [
                Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.SMVTQueryGrid', {
                    itemId: 'MVTQueryGrid'
                })
            ],
            bbar: ['->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var wind = btn.ownerCt.ownerCt;
                        var formComp = wind.getComponent('MVTQueryGrid');
                        var selects = formComp.grid.getSelectionModel().getSelection();
                        if (selects.length > 0) {
                            if (Ext.isEmpty(grid.store.proxy.data)) {
                                grid.store.proxy.data = [];
                            }
                            Ext.Array.each(selects, function (item) {
                                grid.store.proxy.data.push(item.data);
                            });
                            grid.store.load();
                            wind.close();
                        } else {
                            Ext.Msg.alert(i18n.getKey('info'), 'no data submit');
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        btn.ownerCt.ownerCt.close();
                    }
                }]
        }).show();
    },
    /**
     * Mapping添加窗口
     * @param grid
     * @param recd
     * @param index
     */
    editMapping: function (gridField, recd, index) {
        var grid=gridField.getGrid(),leftStore=Ext.data.StoreManager.lookup('leftGridStore'),leftData=[],
            rightComp=gridField.ownerCt.getComponent('right'),rightData=[];
        leftStore.each(function (item){
            leftData.push(item.data);
        })
        // rightComp.store.each(function (item){
        //     rightComp.data.forEach(function (el){
        //         if(item._id==el._id){
        //             rightData.push(item) ;
        //         }
        //     })
        // });
        Ext.create("Ext.window.Window", {
            itemId: "editMapping",
            title: i18n.getKey('selectorMapping'),
            modal: true,
            bodyPadding: 10,
            width: 700,
            height: 350,
            layout: 'fit',
            items: [
                Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.SelectorMappingEdit', {
                    itemId: 'selectorMappingForm',
                    record: recd,
                    leftData:leftData,
                    rightData:rightComp.data
                })
            ],
            bbar: ['->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var wind = btn.ownerCt.ownerCt;
                        var formComp = wind.getComponent('selectorMappingForm');
                        if (formComp.isValid()) {
                            var data = formComp.getValue();
                            if (Ext.isEmpty(grid.store.proxy.data)) {
                                grid.store.proxy.data = [];
                            }
                            if (recd) {//Gridfield操作本地data
                                Ext.Array.splice(grid.store.proxy.data, index, 1, data);
                            } else {
                                grid.store.proxy.data.push(data);
                            }
                            grid.store.load();
                            wind.close();
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        btn.ownerCt.ownerCt.close();
                    }
                }]
        }).show();
    },

    /**
     * 保存简易类型预处理
     * @param data
     * @param createOrEdit
     * @param tab
     */
    saveSimplifyProcess: function (data, createOrEdit, tab) {
        var controller = this;
        tab.el.mask('保存中...');
        var url = adminPath + 'api/pagecontentpreprocess';
        var method = 'POST';
        if (createOrEdit == 'edit') {
            url = adminPath + 'api/pagecontentpreprocess/' + data._id;
            method = 'PUT';
        }

        Ext.Ajax.request({
            url: url,
            method: method,
            jsonData: data,
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    tab.el.unmask();
                    Ext.getCmp('editId').setValue(responseMessage.data._id);
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                } else {
                    tab.el.unmask();
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                tab.el.unmask();
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    },

    showMVTWindow: function (designId, component,selectedData,multiSelect) {
        var win = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.DesignMVT', {
            designId: designId,
            idTextField: component,
            selectedData:selectedData,
            multiSelect:multiSelect
        });
        win.show();
    },

    /**
     * 提取 valueExp return 值
     * @param valueExp
     * @returns {string}
     */
    extractValue:function (valueExp){
        return valueExp.substring(valueExp.search(/return /)+10,valueExp.lastIndexOf('\";}'));
    }
})
