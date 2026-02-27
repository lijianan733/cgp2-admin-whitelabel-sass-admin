Ext.define('CGP.product.view.managerskuattribute.controller.Controller', {

    /**
     * 打开管理sku属性约束界面
     * @param {Ext.tab.Panel} tab 属性约束界面的容器tab
     * @param {Number} skuAttriId sku属性Id
     * @param {Number} configurableId 可配置产品Id
     * @param {Ext.data.Store} store sku属性约束的store
     */
    id: '',
    tab: '',
    managerSkuAttriConstraint: function (tab, skuAttriId, configurableId, store, inputType) {
        var me = this;
        var skuAttriConstraintGrid;
        var inputTypeClazz = (Ext.Array.contains(['DropList', 'CheckBox', 'RadioButtons', 'Color'], inputType)) ? 'com.qpp.cgp.domain.product.attribute.constraint2.single.DiscreteValueConstraint' : 'com.qpp.cgp.domain.product.attribute.constraint2.single.ContinuousValueConstraint';
        var skuAttriConstraintGrid = Ext.getCmp('managerSkuAttriConstraint');
        if (skuAttriConstraintGrid) {
            tab.setActiveTab(skuAttriConstraintGrid);
            skuAttriConstraintGrid.inputType = inputType;
            skuAttriConstraintGrid.skuAttributeId = skuAttriId;
            skuAttriConstraintGrid.store.proxy.url = adminPath + 'api/skuAttributes/' + skuAttriId + '/constraints/v2/';
            skuAttriConstraintGrid.setTitle(i18n.getKey('managerSkuAttriConstraint') + '(' + skuAttriId + ')');
            skuAttriConstraintGrid.getView().refresh();
            skuAttriConstraintGrid.store.load();
            if (inputTypeClazz == 'com.qpp.cgp.domain.product.attribute.constraint2.single.DiscreteValueConstraint') {
                skuAttriConstraintGrid.headerCt.items.items[4].hide();
                skuAttriConstraintGrid.headerCt.items.items[5].hide();
                skuAttriConstraintGrid.headerCt.items.items[6].show();
            } else {
                skuAttriConstraintGrid.headerCt.items.items[4].show();
                skuAttriConstraintGrid.headerCt.items.items[5].show();
                skuAttriConstraintGrid.headerCt.items.items[6].hide();

            }
        } else {
            skuAttriConstraintGrid = Ext.create('CGP.product.view.managerskuattribute.view.ManagerSkuAttrConstraint', {
                skuAttributeId: skuAttriId,
                controller: me,
                id: 'managerSkuAttriConstraint',
                itemId: 'managerSkuAttriConstraint',
                store: store,
                tabPanel: tab,
                configurableId: configurableId,
                inputType: inputType
            });
            tab.add(skuAttriConstraintGrid);
            tab.setActiveTab(skuAttriConstraintGrid);
        }
    },
    /**
     *
     * @param tab
     * @param skuAttriId
     * @param productId
     * @param store skuAttribute的store
     * @param inputType skuAttribute的store
     */
    managerSkuAttriConstraintV2: function (tab, skuAttriId, productId, skuAttributeStore, inputType, record) {
        var me = this;
        var skuAttriConstraintGridV2 = tab.getComponent('ManagerSkuAttrConstraintV2');
        if (skuAttriConstraintGridV2) {
            tab.remove(skuAttriConstraintGridV2);
        }
        skuAttriConstraintGridV2 = Ext.create('CGP.product.view.managerskuattribute.view.ManagerSkuAttrConstraintV2', {
            skuAttributeId: skuAttriId,
            itemId: 'ManagerSkuAttrConstraintV2',
            productId: productId,
            skuAttribute: record.getData(),
            inputType: inputType,
            skuAttributeStore: skuAttributeStore
        });
        tab.add(skuAttriConstraintGridV2);
        tab.setActiveTab(skuAttriConstraintGridV2);
    },

    /**
     * 新建约束时选择需要新建约束的类型
     * @param {Number} skuAttributeId sku属性Id
     * @param {Ext.data.Store} store sku属性约束的store
     * @param {Number} configurableId 可配置产品Id
     * @param {Ext.tab.Panel} tab 属性约束界面的容器tab
     */
    selectConstraintType: function (skuAttributeId, store, recordId, tab, createOrEdit, inputType, data, configurableId) {
        var createOrEdit = createOrEdit;
        var inputTypeClazz = (Ext.Array.contains(['DropList', 'CheckBox', 'RadioButtons', 'Color'], inputType)) ? 'com.qpp.cgp.domain.product.attribute.constraint2.single.DiscreteValueConstraint' : 'com.qpp.cgp.domain.product.attribute.constraint2.single.ContinuousValueConstraint';
        var controller = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainter.controller.Controller');
        var EditContinuousValueConstraintForm = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainter.view.EditContinuousValueConstraintForm', {
            skuAttributeId: skuAttributeId,
            configurableId: configurableId,
            createOrEdit: createOrEdit,
            inputTypeClazz: inputTypeClazz,
            recordId: recordId,
            id: 'EditContinuousValueConstraintForm',
            tab: tab,
            listeners: {
                'afterrender': function () {
                    if (createOrEdit == 'edit') {
                        controller.setContinuousFormValue(EditContinuousValueConstraintForm, data);//第二个参数需要传入record的数据
                    }
                }
            }
        });
        var EditDiscreteValueConstraintForm = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainter.view.EditDiscreteValueConstraintForm', {
            skuAttributeId: skuAttributeId,
            createOrEdit: createOrEdit,
            configurableId: configurableId,
            inputTypeClazz: inputTypeClazz,
            recordId: recordId,
            tab: tab,
            id: 'EditDiscreteValueConstraintForm',
            listeners: {
                'afterrender': function () {
                    if (createOrEdit == 'edit') {
                        controller.setDiscreteFormValue(EditDiscreteValueConstraintForm, data);
                        EditDiscreteValueConstraintForm.items.items[3].isValid();
                    }
                }
            }
        });
        var panel = tab.getComponent('EditAtrributeConstraintPanel');
        if (Ext.isEmpty(panel)) {
            var panel = Ext.create('Ext.panel.Panel', {
                layout: 'fit',
                title: i18n.getKey(createOrEdit) + i18n.getKey('skuAttriConstraint'),
                id: 'EditAtrributeConstraintPanel',
                closable: true,//是否显示关闭按钮,
                autoScroll: true
            });
            if (inputTypeClazz == 'com.qpp.cgp.domain.product.attribute.constraint2.single.DiscreteValueConstraint') {
                panel.add(EditDiscreteValueConstraintForm);

            } else {
                panel.add(EditContinuousValueConstraintForm);
            }
            tab.add(panel);
            tab.setActiveTab(panel);
        } else {
            tab.remove(panel);
            var panel = Ext.create('Ext.panel.Panel', {
                layout: 'fit',
                title: i18n.getKey(createOrEdit) + i18n.getKey('skuAttriConstraint'),
                id: 'EditAtrributeConstraintPanel',
                closable: true,//是否显示关闭按钮,
                autoScroll: true
            });
            if (inputTypeClazz == 'com.qpp.cgp.domain.product.attribute.constraint2.single.DiscreteValueConstraint') {
                EditDiscreteValueConstraintForm.configurableId = configurableId;
                panel.add(EditDiscreteValueConstraintForm);

            } else {
                EditDiscreteValueConstraintForm.configurableId = configurableId;
                panel.add(EditContinuousValueConstraintForm);
            }
            tab.add(panel);
            tab.setActiveTab(panel);
        }
    },
    /**
     * 编辑属性约束
     * @param {String} editOrNew 分辨编辑或新建
     * @param {String} constraintType 约束的类型
     * @param {Number} skuAttributeId sku属性Id
     * @param {Ext.window.Window} selectTypeWin 选择属性约束类型的窗口
     * @param {Ext.data.Store} store sku属性约束的store
     * @param {Ext.data.Model} record 需要编辑的Model
     * @param {Number} configurableId 可配置产品Id
     * @param {Ext.tab.Panel} tab 属性约束界面的容器tab
     */
    editConstraintWin: function (editOrNew, constraintType, skuAttributeId, selectTypeWin, store, record, configurableId, tab) {
        var me = this;
        var editConstraintWin;
        editConstraintWin = Ext.getCmp('editConstraint');
        if (editConstraintWin) {
            tab.remove(editConstraintWin);
            //editConstraintWin.getStore().proxy.url = adminPath + 'api/skuAttributes/'+skuAttriId+'/constraints';
            //editConstraintWin.getStore().load();
        }
        editConstraintWin = Ext.create('CGP.product.view.managerskuattribute.view.edit.EditConstraintWin', {
            editOrNew: editOrNew,
            store: store,
            constraintType: constraintType,
            selectTypeWin: selectTypeWin,
            configurableId: configurableId,
            skuAttributeId: skuAttributeId,
            record: record,
            controller: me
        });
        tab.add(editConstraintWin);
        tab.setActiveTab(editConstraintWin);
    },
    /**
     * 新建属性约束
     * @param {Ext.form.Panel} editWin 编辑属性的窗口
     * @param {Ext.window.Window} selectTypeWin 选择属性约束类型的窗口
     * @param {Ext.data.Store} store sku属性约束的store
     * @param {Json} data 提交的数据
     */
    createContraint: function (editWin, selectTypeWin, store, data) {
        Ext.Ajax.request({
            url: adminPath + 'api/skuAttributeConstraints',
            method: 'POST',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                var data = responseMessage.data;
                if (responseMessage.success) {
                    editWin.getComponent('id').setValue(data._id);
                    editWin.setTitle(i18n.getKey('edit') + i18n.getKey('constraint') + '(' + data._id + ')');
                    if (!Ext.isEmpty(selectTypeWin)) {
                        selectTypeWin.close();
                    }
                    store.load();
                    Ext.Msg.alert('提示', '添加成功!')
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    /**
     * 删除属性约束
     * @param {Ext.data.Store} store sku属性约束的store
     * @param {String} constraintId 需要删除的属性约束ID
     */
    deleteContraint: function (store, constraintId) {
        Ext.Msg.confirm('提示', '删除成功!');
        Ext.Ajax.request({
            url: adminPath + 'api/skuAttributeConstraints/' + constraintId,
            method: 'DELETE',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    store.load();
                    Ext.Msg.alert('提示', '删除成功!')
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    /**
     * 更新属性约束
     * @param {Ext.form.Panel} editWin 编辑属性的窗口
     * @param {Ext.window.Window} selectTypeWin 选择属性约束类型的窗口
     * @param {Ext.data.Store} store sku属性约束的store
     * @param {Json} data 提交的数据
     */
    updateContraint: function (editWin, selectTypeWin, store, data) {
        Ext.Ajax.request({
            url: adminPath + 'api/skuAttributeConstraints/' + data['_id'],
            method: 'PUT',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    if (!Ext.isEmpty(selectTypeWin)) {
                        selectTypeWin.close();
                    }
                    store.load();
                    Ext.Msg.alert('提示', '修改成功!')
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    /**
     * 编辑正则约束值得键值对
     * @param {String} editOrNew 该条键值对是新建或编辑状态
     * @param {Ext.data.Store} store RegexValues的数据
     * @param {Ext.data.Model} record 该条regexValue的数据
     * @param {Number} configurableId 可配置产品Id
     */
    editRegexValue: function (editOrNew, store, record, configurableId) {
        Ext.create('CGP.product.view.managerskuattribute.view.edit.EditRegexValue', {
            editOrNew: editOrNew,
            store: store,
            configurableId: configurableId,
            record: record
        }).show();
    },

    /**
     * 添加新的sku属性
     * @param skuAttributeGrid 展示sku属性的grid
     */
    addSkuAttribute: function (skuAttributeGrid) {
        var me = this;
        var productId = me.id;
        var window = new Ext.window.Window({
            title: i18n.getKey('addAttribute'),
            modal: true,
            width: 950,
            height: 600,
            layout: 'fit',
            items: [{
                xtype: 'selectattributegrid',
                productId: productId,
                isSku: false,
                skuAttributeGrid: skuAttributeGrid
            }],
            bbar: ['->', {
                xtype: 'button',
                text: i18n.getKey('ok'),
                iconCls: 'icon_add',
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    var controller = Ext.create('CGP.product.view.managerskuattribute.controller.Controller');
                    var generalAttributeGrid = win.items.items[0];
                    if (generalAttributeGrid.grid.isValid()) {
                        controller.submitAdd(generalAttributeGrid.grid, skuAttributeGrid, productId, true);
                    }
                }
            }, {
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    win.close();
                }
            }]
        });

        window.show();
    },
    /**
     * 添加新的sku属性
     * @param skuAttributeGrid 展示sku属性的grid
     */
    addNoSkuAttribute: function (skuAttributeGrid) {
        var me = this;
        var productId = me.id;
        var window = new Ext.window.Window({
            title: i18n.getKey('addAttribute'),
            modal: true,
            layout: 'fit',
            items: [{
                xtype: 'selectnoattributegrid',
                productId: productId,
                isSku: false,
                skuAttributeGrid: skuAttributeGrid
            }],
            bbar: ["->", {
                xtype: 'button',
                text: i18n.getKey('ok'),
                iconCls: 'icon_add',
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    var controller = Ext.create('CGP.product.view.managerskuattribute.controller.Controller');
                    var generalAttributeGrid = win.items.items[0];
                    if (generalAttributeGrid.grid.isValid()) {
                        controller.submitAdd(generalAttributeGrid.grid, skuAttributeGrid, productId, false);
                    }
                }
            }, {
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    win.close();
                }
            }]
        });

        window.show();
    },
    /**
     * 添加属性
     * @param generalAttributeGrid 选择属性grid
     * @param skuAttributeGrid sku属性展示grid
     * @param productId sku属性所属的产品id
     * @param isSku 是否SKU属性
     */
    submitAdd: function (generalAttributeGrid, skuAttributeGrid, productId, isSku) {
        var controller = this;
        var grid = generalAttributeGrid;
        var attributes = grid.selectedRecords.items;
        var attributeArr = [];
        Ext.Array.each(attributes, function (attribute) {
            attributeArr.push({
                "isSku": isSku,
                "readOnly": false,
                "attributeId": attribute.get('id'),
                "enable": attribute.get('enable'),
                "hidden": attribute.get('hidden'),
                "required": true
            });
            //遍历属性，把属性添加的对应的profile里面
        });

        if (Ext.isEmpty(attributeArr)) {
            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('pleaseSelectAttribute'));
            return;
        }

        Ext.Ajax.request({
            url: adminPath + 'api/products/configurable/' + productId + '/skuAttributes',
            method: 'POST',
            jsonData: {attributeDefaultValues: attributeArr},
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('添加成功!') + '!');
                    var store = skuAttributeGrid.getStore();
                    var datas = [];
                    Ext.Array.each(attributes, function (attribute) {
                        datas.push(attribute.data);
                    });
                    store.load();
                    controller.addAttributeToProfile(generalAttributeGrid, resp.data.skuAttributes);
                    grid.ownerCt.ownerCt.close();

                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                }

            },
            failure: function (resp, options) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    /**
     * 把添加的属性也添加到指定的profiel分组中
     * @param data
     */
    addAttributeToProfile: function (generalAttributeGrid, skuAttributeArr) {
       ;
        var profileAttributeData = generalAttributeGrid.profileAttributeData;
        var result = {};
        for (var i = 0; i < skuAttributeArr.length; i++) {
            var skuAttribute = skuAttributeArr[i];
            var attributeId = skuAttributeArr[i].attributeId;
            if (profileAttributeData[attributeId]) {//该属性配置了指定profile，和group
                var profileId = profileAttributeData[attributeId].profileId;
                var groupId = profileAttributeData[attributeId].groupId;
                if (result[profileId]) {

                } else {
                    result[profileId] = generalAttributeGrid.profileStore.getById(profileId).getData();
                }
                for (var j = 0; j < result[profileId].groups.length; j++) {
                    if (groupId == result[profileId].groups[j]._id) {
                        if (Ext.isEmpty(result[profileId].groups[j].skuAttributes)) {
                            result[profileId].groups[j].skuAttributes = [];
                            for (var k = 0; k < result[profileId].groups[j].attributes.length; k++) {
                                result[profileId].groups[j].skuAttributes.push(result[profileId].groups[j].attributes[k].id);
                            }
                        }
                        result[profileId].groups[j].skuAttributes.push(skuAttribute.id);
                    }
                }
            }
        }
        console.log(result);

        /*   var comboFieldArr = generalAttributeGrid.query("combo[disabled=false]");
           var profileStore = generalAttributeGrid.profileStore;
           var profileComboArr = [];
           var groupComboArr = [];
           var resultData = {};
           for (var i = 0; i < comboFieldArr.length; i++) {
               if (comboFieldArr[i].itemId.includes('profile')) {
                   profileComboArr.push(comboFieldArr[i]);
               } else {
                   groupComboArr.push(comboFieldArr[i]);
               }
           }
           //统计出有哪些profile
           for (var i = 0; i < profileComboArr.length; i++) {
               var attributeId = profileComboArr[i].attributeId;
               var profileId = profileComboArr[i].getValue();
               var profileData = profileStore.getById(profileId).getData();
               if (resultData[profileId]) {
               } else {
                   resultData[profileId] = profileData;
               }
           }
           //把属性对应的SkuAttribute添加到对应的profile中
           for (var i = 0; i < groupComboArr.length; i++) {
               var attributeId = groupComboArr[i].attributeId;
               var profileId = groupComboArr[i].profileId;
               var groupId = groupComboArr[i].getValue();
               var profileData = resultData[profileId];
               var skuAttributeData = null;
               for (var j = 0; j < skuAttributeArr.length; j++) {
                   if (skuAttributeArr[j].attributeId == attributeId) {
                       skuAttributeData = skuAttributeArr[j];
                       continue;
                   }
               }
               for (var j = 0; j < profileData.groups.length; j++) {
                   if (profileData.groups[j]._id == groupId) {
                       profileData.groups[j].attributes.push(skuAttributeData);
                       continue;
                   }
               }
           }*/
        var saveAttributeProfile = function (data) {
            var url;
            var jsonData = data;
            url = adminPath + 'api/attributeProfile/' + data._id;
            Ext.Ajax.request({
                url: url,
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: jsonData,
                success: function (response, options) {
                    var resp = Ext.JSON.decode(response.responseText);
                    if (resp.success) {
                    } else {
                        Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                    }
                },
                failure: function (response, options) {
                    var object = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
                }
            });
        }
        for (var i in result) {
            console.log(result[i]);
            //服了，这数据的传输格式
            saveAttributeProfile(result[i])
        }

    },

    /**
     * 检查该产品下的SkuProduct有该属性的Sku多少种
     * @param attributeId
     * @param productId
     * @param inputType
     * @param skuAttributeId
     *  @param skuAttributeGrid
     */
    removeSkuAttribute: function (attributeId, productId, inputType, skuAttributeId, skuAttributeGrid) {
        //获得目前拥有的已经使用的options
        skuAttributeGrid.el.mask('处理中...');
        skuAttributeGrid.updateLayout();
        var request = {
            method: 'GET',
            url: adminPath + 'api/products/configurable/' + productId + '/' + attributeId + '/options?access_token=' + Ext.util.Cookies.get('token'),
            success: function (response) {
                skuAttributeGrid.el.unmask();
                var resp = Ext.JSON.decode(response.responseText);
                var options = resp.data;
                var optionValue;
                if (options.length <= 1) {
                    if (options.length == 1) {
                        optionValue = options[0].optionIds;
                    } else {
                        optionValue = "";
                    }

                    Ext.Ajax.request({
                        method: 'PUT',
                        url: adminPath + 'api/products/configurable/' + productId + '/' + attributeId + '/options?access_token=' + Ext.util.Cookies.get('token') + '&option=' + optionValue,
                        success: function (response, options) {
                            var resp = Ext.JSON.decode(response.responseText);
                            if (resp.success) {
                                var store = skuAttributeGrid.getStore();
                                store.remove(store.getById(skuAttributeId));
                                skuProductGrid.getStore().load();

                            } else {
                                Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                            }
                        },
                        failure: function (resp, options) {
                            var response = Ext.JSON.decode(resp.responseText);
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        }
                    });

                    return;

                }

                //生成raidos
                var items = [];
                Ext.Array.each(options, function (option) {
                    var item = {
                        boxLabel: option.value,
                        name: 'option',
                        inputValue: option.optionIds
                    };
                    items.push(item);
                })
                var optionForm = new Ext.form.Panel({
                    region: 'center',
                    items: [
                        {
                            xtype: 'radiogroup',
                            fieldLabel: 'Options',
                            itemId: 'radiogroup',
                            defaults: {
                                flex: 1
                            },
                            layout: 'hbox',
                            items: items
                        }
                    ],
                    tbar: [
                        {
                            xtype: 'button',
                            text: 'save',
                            handler: saveSelectOption
                        }
                    ]
                });

                var window = new Ext.window.Window({
                    title: i18n.getKey('options'),
                    layout: 'border',
                    width: 600,
                    height: 400,
                    items: [optionForm]
                });

                window.show();

                //保留选中的option
                function saveSelectOption() {
                    var radiogroup = this.ownerCt.ownerCt.getComponent('radiogroup');
                    var option = radiogroup.getValue().option;

                    Ext.Ajax.request({
                        method: 'PUT',
                        url: adminPath + 'api/products/configurable/' + productId + '/' + attributeId + '/options?access_token=' + Ext.util.Cookies.get('token') + '&option=' + option,
                        success: function (response, options) {
                            var resp = Ext.JSON.decode(response.responseText);
                            if (resp.success) {
                                var store = skuAttributeGrid.getStore();
                                store.remove(store.getById(skuAttributeId));
                                Ext.getCmp('SkuProductGrid').getStore().load();
                                window.close();
                            } else {
                                Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                            }
                        },
                        failure: function (resp, options) {
                            var response = Ext.JSON.decode(resp.responseText);
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        }
                    });

                }
            },
            failure: function (resp, options) {
                skuAttributeGrid.el.unmask();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        }
        if (Ext.Array.contains(['DropList', 'CheckBox', 'RadioButtons', 'Color'], inputType)) {
            Ext.Ajax.request(request);
        } else {
            Ext.Ajax.request({
                method: 'PUT',
                url: adminPath + 'api/products/configurable/' + productId + '/' + attributeId + '/options?access_token=' + Ext.util.Cookies.get('token') + '&option=null',
                success: function (response, options) {
                    skuAttributeGrid.el.unmask();
                    var resp = Ext.JSON.decode(response.responseText);
                    if (resp.success) {
                        var store = skuAttributeGrid.getStore();
                        store.remove(store.getById(skuAttributeId));
                        /*
                                                Ext.getCmp('SkuProductGrid').getStore().load();
                        */
                        Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('removeskuattrsu') + '!');


                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                    }
                },
                failure: function (resp, options) {
                    skuAttributeGrid.el.unmask();
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            });
        }

    },
    /**
     * confing配置对象，该对象中有
     * @param config 包含参数的配置对象
     * @AttributeGrid 属性页
     * @tab 外层的table.panel
     */
    addProductColumns: function (config) {
        var skuAttributeGrid = config.skuAttributeGrid;
        var skuAttributeStore = skuAttributeGrid.getStore();
        var productId = config.productId;
        var tab = config.tab;
        var activeTab = config.activeTab;
        var skuAttributeIds = [];
        skuAttributeStore.load({
            scope: this,
            async: false,
            callback: function (skuAttributes, operation, success) {
                var skuAttributeColumns = [];
                skuAttributeColumns.push({
                    autoSizeColumn: 'false',
                    width: 100,
                    dataIndex: 'id',
                    text: i18n.getKey('id')
                });
                skuAttributeColumns.push({
                    autoSizeColumn: false,
                    width: 150,
                    dataIndex: 'sku',
                    text: 'SKU'
                });
                Ext.Array.each(skuAttributes, function (skuAttribute) {
                    var skuAttributeColumn = {};
                    skuAttributeIds.push(skuAttribute.get('attribute').id);
                    skuAttributeColumn.text = skuAttribute.get('attribute').code;
                    skuAttributeColumn.renderer = function (value, metadata, record, rowIndex, colIndex, store, view) {
                        var value = [];
                        Ext.Array.each(record.data.attributeValues, function (attributeValue) {
                            if (Ext.Array.contains(skuAttributeIds, attributeValue['attributeId'])) {
                                var optionIds = attributeValue['optionIds'];
                                if (optionIds) {
                                    Ext.Array.each(optionIds.split(','), function (optionId) {
                                        Ext.Array.findBy(skuAttribute.get('attribute').options, function (option) {
                                            if (option['id'] == optionId) {
                                                value.push(option['name']);
                                            }
                                        })
                                    })
                                } else {
                                    if (attributeValue['attributeId'] == skuAttribute.get('attribute').id) {
                                        value.push(attributeValue['value']);
                                    }
                                }
                            }

                        });
                        return value.join(',');
                    };
                    skuAttributeColumns.push(skuAttributeColumn);

                });
                skuAttributeColumns.push({
                    dataIndex: 'salePrice',
                    width: 150,
                    text: i18n.getKey('salePrice')
                });

                skuAttributeColumns.push({
                    dataIndex: 'weight',
                    text: i18n.getKey('weight')
                });
                var SkuProductGrid = Ext.create('CGP.product.view.managerskuattribute.view.SkuProductGrid', {
                    gridId: 'SkuProductGrid',
                    skuAttributeGrid: skuAttributeGrid,
                    productId: productId,
                    tab: tab,
                    productColumns: skuAttributeColumns
                });
                tab.add(SkuProductGrid);
                if (activeTab) {
                    tab.setActiveTab(SkuProductGrid);
                }
            }
        });

    },
    /**
     *展现修改sku属性window
     * @param value 记录的当前值
     * @param metaData
     * @param record 当前记录
     * @param rowIndex 记录的id
     * @param isSku 是否是sku属性
     * @param id 记录的id
     * @param skuAttributeGrid skuAttributeGrid实例
     * @returns {Ext.button.Button}
     */
    modifySkuAttribute: function (value, metaData, record, rowIndex, isSku, id, skuAttributeGrid) {
        var productId = skuAttributeGrid.productId;
        var isLock = JSCheckProductIsLock(productId);
        Ext.create('CGP.product.view.managerskuattribute.view.modifySKuAttributeWindow', {
            record: record,
            isLock: isLock,
            skuAttributeGrid: skuAttributeGrid,
            isSku: isSku,
            id: id
        }).show();

    },
    /**
     *提交修改sku属性请求
     * @param id 产品id
     * @param data form的数据
     * @param record 记录的id
     * @param skuAttributeGrid skuAttributeGrid属性展示页面
     * @param win 当前的window
     */
    confirmModifySkuAttribute: function (id, data, record, skuAttributeGrid, win) {
        Ext.Ajax.request({
            url: adminPath + 'api/products/configurable/' + id + '/skuAttributes/' + record.get('id'),
            method: 'PUT',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var response = Ext.JSON.decode(res.responseText);
                if (response.success) {
                    Ext.Msg.alert('提示', '修改成功!', function close() {
                        skuAttributeGrid.store.load();
                        win.close();
                    })
                } else {
                    Ext.Msg.alert('提示', '修改失败:' + response.data.message)
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    }


});
