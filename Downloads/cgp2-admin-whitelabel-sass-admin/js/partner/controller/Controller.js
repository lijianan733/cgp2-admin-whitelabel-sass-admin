Ext.syncRequire(['CGP.partner.model.SalerConfigModel']);
Ext.define('CGP.partner.controller.Controller', {

    /**
     * 1.显示合作用户的窗口
     * @param {Number} partnerId 合作伙伴ID
     * @param {Number} websiteId 网站ID
     */
    showCooperationUsersWin: function (partnerId, websiteId, websiteName) {
        var me = this;
        Ext.create('CGP.partner.view.CooperationUsersWin', {
            controller: me,
            partnerId: partnerId,
            websiteId: websiteId,
            websiteName: websiteName
        }).show();
    },
    /**
     * 显示可以使用的产品列表
     * @param {Number} partnerId 合作伙伴ID
     * @param {Number} websiteId 网站ID
     */
    showEnabelProductManageWin: function (partnerId, websiteId, websiteName) {
        var me = this;
        /*      var enAbleProductWin = Ext.create('CGP.partner.view.EnabelProductManagePage', {
         controller: me,
         partnerId: partnerId,
         websiteId: websiteId,
         websiteName: websiteName
         });
         enAbleProductWin.show();*/
        JSOpen({
            id: 'EnabelProductManagePage',
            url: path + 'partials/partner/enableproductmanage/enableProductManagePage.html?partnerId=' + partnerId + '&websiteId=' + websiteId,
            title: i18n.getKey('enabelProductManage'),
            refresh: true
        });
    },
    /**
     * 2.显示订单接口参数窗口
     * @param {Number} partnerId 合作用户ID
     */
    orderPortParams: function (partnerId, websiteId) {
        var me = this;
        Ext.create('CGP.partner.view.OrderPortParams', {
            partnerId: partnerId,
            websiteId: websiteId,
            groupId: 19,
            controller: me
        })
    },
    /**
     * 3.基本参数配置窗口
     * @param {Number} id 合作用户ID
     */
    basicParamCfg: function (id, websiteId) {
        var me = this;
        Ext.create('CGP.partner.view.BasicParamCfg', {
            websiteId: websiteId,
            partnerId: id,
            controller: me,
            groupId: 22
        })
    },

    /**
     * 4.显示用于邮件发送邮箱窗口
     * @param {Number} partnerId 合作用户ID
     */
    customerEmailSendMail: function (partnerId, websiteId) {
        var me = this;
        Ext.create('CGP.partner.view.CustomerEmailSendMail', {
            websiteId: websiteId,
            partnerId: partnerId,
            groupId: 20,
            controller: me
        })
    },
    /**
     * 5.显示管理员邮件发送邮箱窗口
     * @param {Number} partnerId 合作用户ID
     */
    managerEmailSendMail: function (partnerId, websiteId) {
        var me = this;
        Ext.create('CGP.partner.view.ManagerEmailSendMail', {
            websiteId: websiteId,
            partnerId: partnerId,
            groupId: 21,
            controller: me
        })
    },
    /**
     * 创建订单邮件模板窗口
     * @param {Number} partnerId 合作伙伴ID
     */
    orderMailTemplate: function (partnerId, websiteId) {
        Ext.create('CGP.partner.view.MailTemplateWin', {
            partnerId: partnerId,
            websiteId: websiteId
        });
    },
    /**
     * 保存修改配置的方法
     * @param {Ext.form.Panel} page 提交的form
     * @param {Ext.data.Store} store 数据的store
     */
    modify: function (page, store) {
        var values = Ext.Object.getValues(page.getValues());//获取表单中所有的值，包括空值
        var fields = page.getForm().getFields().items;//获取所有的字段
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var index = store.findBy(function (record) {
                return record.get('key') == field.key;
            });
            var record = store.getAt(index);
            //在store中没有itemId
            if (record == undefined) {
                if (values[i].toString() == "" || values[i].toString() == "NaN") {
                } else { //空值不保存
                    store.add({
                        groupId: store.groupId,
                        title: field.fieldLabel,
                        websiteId: store.websiteId,
                        key: field.key,
                        value: values[i].toString(),
                        //itemId:i,
                        sortOrder: i
                    });
                }
            } else {
                //在store中有itemId
                if (field.getValue() != record.get('value').toString()) {
                    record.set('value', field.getValue().toString());
                }
            }
        }
        store.proxy.url = adminPath + 'api/configurations';
        store.sync();
        Ext.MessageBox.alert('提示', '保存成功！');
        /*
         page.ownerCt.close();
         */
    },
    /**
     * nan保存修改配置的方法
     * @param {Ext.form.Panel} page 提交的form
     * @param {Ext.data.Store} store 数据的store
     */
    nanModify: function (page, store) {
        var values = Ext.Object.getValues(page.getValues());//获取表单中所有的值，包括空值
        var fields = page.getForm().getFields().items;//获取所有的字段
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var index = store.findBy(function (record) {
                return record.get('key') == field.key;
            });
            var record = store.getAt(index);
            //在store中没有itemId
            if (record == undefined) {
                if (Ext.isEmpty(values[i]) || values[i].toString() == "" || values[i].toString() == "NaN") {
                } else { //空值不保存
                    store.add({
                        groupId: store.groupId,
                        title: field.fieldLabel,
                        websiteId: store.websiteId,
                        key: field.key,
                        value: values[i].toString(),
                        //itemId:i,
                        sortOrder: i
                    });
                }
            } else {
                //在store中有itemId
                if (field.getValue() != record.get('value').toString()) {
                    record.set('value', field.getValue());
                }
            }
        }
        store.proxy.url = adminPath + 'api/configurations';
        store.sync();
        Ext.MessageBox.alert('提示', '保存成功！');
        /*
         page.ownerCt.close();
         */
    },
    /**
     * 恢复修改前的已保存配置
     * @param {Ext.form.Panel} page 提交的form
     * @param {Ext.data.Store} store 数据的store
     */
    reset: function (page, store) {
        var values = [];
        var fields = page.getForm().getFields().items;
        for (var j = 0; j < fields.length; j++) {
            var field = fields[j];
            var record = store.getAt(field.itemId);
            //在store中没有itemId
            if (record == undefined) {
                page.getForm().reset();
            } else {
                //在store中有itemId
                for (var i = 0; i < (store.getCount()); i++) {
                    var conf = store.getAt(i);
                    name = conf.get('title');
                    value = conf.get('value');
                    values.push({
                        id: name,
                        value: value
                    });
                }
            }
        }
        page.getForm().setValues(values);
    },

    /*reset: function(page, store) {
     var values = [];
     console.log(store.getCount());
     for(var i = 0; i < (store.getCount()); i++) {
     var conf = store.getAt(i);
     id = conf.get('id');
     value = conf.get('value');
     values.push({
     id: id,
     value: value
     });
     }
     page.getForm().setValues(values);
     },*/

    /**
     * 创建验证邮箱配置有效性的窗口
     * @param {Object} mailCfgData 邮箱的配置数据
     */
    showVerifyMailWin: function (mailCfgData) {
        var me = this;
        Ext.create('CGP.partner.view.VerifyMailWin', {
            mailCfgData: mailCfgData,
            controller: me
        }).show();
    },

    /**
     * 验证邮箱有效性
     * @param {Object} jsonData 验证邮箱时发送请求的数据
     * @param {CGP.partner.view.verifyMailWin} verifyMailWin 验证邮箱有效性的窗口
     */
    verifyMail: function (jsonData, verifyMailWin) {
        var loadMask = verifyMailWin.setLoading(true);
        Ext.Ajax.request({
            url: adminPath + 'api/configurations/verifyMailServer',
            jsonData: jsonData,
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (resp) {
                loadMask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                if (response.success == true) {
                    Ext.Msg.alert('提示', '邮箱配置有效！', function close() {
                        verifyMailWin.close()
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                loadMask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },

    /**
     * 增加合作用户的窗口
     * @param {Object} data 已有合作用户的集合
     * @param {Number} partnerId 合作伙伴ID
     * @param {Ext.data.Store} store 合作用户的store
     */
    showAddUsersWin: function (data, partnerId, store, websiteId, websiteName) {
        var me = this;
        Ext.create('CGP.partner.view.AddUsersWin', {
            controller: me,
            partnerId: partnerId,
            data: data,
            store: store,
            websiteId: websiteId,
            websiteName: websiteName
        }).show();
    },
    /**
     * 增加合作用户的执行方法
     * @param {CGP.partner.view.AddUsersWin} addUsersWin 增加用户窗口实例
     */
    addUsers: function (addUsersWin) {
        var addCollection = addUsersWin.getComponent('allUList').collection;
        var userIdList = [];
        for (var i = 0; i < addCollection.length; i++) {
            userIdList.push({id: addCollection.keys[i]});
        }
        var jsonData = {
            userIdList: userIdList
        };
        var requestconfig = {
            url: adminPath + 'api/partners/' + addUsersWin.partnerId + '/users',
            method: 'POST',
            jsonData: jsonData,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseData = Ext.JSON.decode(response.responseText);
                {
                    if (responseData.success == true) {
                        Ext.Msg.alert('提示', '增加用户成功！', function close() {
                            addUsersWin.store.load();
                            addCollection.clear();
                            addUsersWin.close();
                        });
                    } else {
                        Ext.Msg.alert('提示', '增加用户失败！失败信息：' + responseData.message);
                    }
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        }
        if (Ext.isEmpty(userIdList)) {
            Ext.Msg.alert('提示', '未选择添加用户！');
        } else {
            Ext.Ajax.request(requestconfig);
        }
    },
    /**
     * 修改文件内容的方法
     * @param {String} fileContent 文件内容
     * @param {Number} fileId 文件ID
     * @param {String} target 邮件模板类型
     * @param {Number} websiteId 网站ID
     * @param {String} modifyContent 修改的文件内容
     * @param {Number} partnerId 合作伙伴ID
     */
    modifyFileTemplateContent: function (fileContent, fileId, target, websiteId, modifyContent, partnerId, contentWin) {
        var me = this;
        Ext.Ajax.request({
            url: adminPath + 'api/configurations/mailtemplatefilenames/' + fileId + '/content?target=' + target + '&websiteId=' + websiteId + '&partnerId=' + partnerId,
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + Ext.util.Cookies.get('token'),
                'Content-Type': 'text/plain'
            },
            params: modifyContent,
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                var isSuccess = response.success;
                if (isSuccess == true) {
                    Ext.Msg.alert('提示', '修改成功！', function close() {
                        contentWin.close();
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    /**
     * 预览邮件模板文件内容
     * @param {string} content
     */
    previeEmailTemplateFile: function (content) {

        Ext.create('Ext.window.Window', {
            width: 800,
            height: 500,
            modal: true,
            title: i18n.getKey('preview'),
            autoScroll: true,
            html: content
        }).show();
    },
    /**
     * 打开默认地址配置窗口
     * @param id partnerId
     * @param websiteId 网站Id
     */
    defaultAddressWin: function (id, websiteId) {
        var me = this;
        Ext.create('CGP.partner.view.config.DefaultAddress', {
            websiteId: websiteId,
            partnerId: id,
            controller: me,
            groupId: 25
        })
    },
    /**
     * 显示邮件模板文件内容
     * @param {Number} fileId 模板文件ID
     * @param {Type} target 邮件模板类型
     * @param {Number} websiteId 网站ID
     * @param {Number} partnerId 合作伙伴ID
     */
    showMailtemplateFileContent: function (fileId, target, websiteId, partnerId) {
        var me = this;
        Ext.Ajax.request({
            url: adminPath + 'api/configurations/mailtemplatefilenames/' + fileId + '/content?target=' + target + '&websiteId=' + websiteId + '&partnerId=' + partnerId,
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText)
                var fileContent = response.data.content;
                if (!response.success) {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    return;
                }
                Ext.create('Ext.window.Window', {
                    layout: 'fit',
                    modal: true,
                    id: 'fileContentWin',
                    title: i18n.getKey('mailFileTempalteContent'),
                    items: [
                        {
                            xtype: 'textarea',
                            id: 'fileContent',
                            width: 800,
                            height: 500,
                            autoScroll: true,
                            value: fileContent
                        }
                    ],
                    bbar: ['->', {
                        xtype: 'button',
                        text: i18n.getKey('preview'),
                        iconCls: 'icon_preview',
                        handler: function () {
                            me.previeEmailTemplateFile(Ext.getCmp('fileContent').getValue());
                        }
                    }, {
                        xtype: 'button',
                        text: i18n.getKey('confirmModify'),
                        iconCls: 'icon_agree',
                        handler: function () {
                            var modifyContent = Ext.getCmp('fileContent').getValue();
                            var contentWin = Ext.getCmp('fileContentWin');
                            me.modifyFileTemplateContent(fileContent, fileId, target, websiteId, modifyContent, partnerId, contentWin);
                        }
                    }]
                }).show();

            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }

        });
    },
    /**
     * 打开默认配置的窗口
     * @param id
     * @param websiteId
     */
    defaultConfigWin: function (id, websiteId) {
        var me = this;
        Ext.create('CGP.partner.view.config.DefaultConfigWindow', {
            websiteId: websiteId,
            partnerId: id,
            controller: me,
            groupId: 24
        })
    },
    /**
     * 修改指定配置
     * @param data 地址数据
     * @param recordData 此配置的数据
     */
    modifyConfiguration: function (data, recordData) {
        var me = this;
        var jsonData = recordData;
        jsonData.value = data;
        Ext.Ajax.request({
            url: adminPath + 'api/configurations/' + recordData.id,
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: jsonData,
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                var isSuccess = response.success;
                if (isSuccess == true) {
                    Ext.Msg.alert('提示', '修改成功！');
                } else {
                    Ext.Msg.alert('提示', response.data.message);
                }
            },
            failure: function (resp) {
                var message = Ext.JSON.decode(resp.responseText).data.message;
                Ext.Msg.alert('提示', message);
            }
        })
    },
    /**
     *新建配置
     * @param data 配置的数据
     * @param window 新建的窗口
     */
    createConfiguration: function (data, window) {
        var mask = window.setLoading();
        Ext.Ajax.request({
            url: adminPath + 'api/configurations',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                var isSuccess = response.success;
                if (isSuccess == true) {
                    mask.hide();
                    window.recordData = response.data;
                    Ext.Msg.alert('提示', '创建成功！');
                } else {
                    mask.hide();
                    Ext.Msg.alert('提示', response.data.message);
                }
            },
            failure: function (resp) {
                mask.hide();
                var message = Ext.JSON.decode(resp.responseText).data.message;
                Ext.Msg.alert('提示', message);
            }
        })
    },
    /**
     * 打开额外属性配置窗口
     * @param id partnerId
     * @param websiteId 网站Id
     */
    extraParemsWin: function (id, websiteId) {
        var me = this;
        Ext.create('CGP.partner.view.config.ExtraParamsConfig', {
            websiteId: websiteId,
            partnerId: id,
            controller: me,
            groupId: 24
        })
    },
    /**
     * 创建添加可以产品的弹窗
     * @param id partner的id
     * @param websiteId partner的所属网站id
     * @param store 展示可以产品界面的store
     */
    addProductWindow: function (id, websiteId, store) {
        var me = this;
        var wind = Ext.create('CGP.common.productsearch.ProductSearchWin', {
            width: 1000,
            height: 700,
            title: i18n.getKey('enabelProductGrid'),
            filterCfg: {
                height: 120,
                skuFilter: {},
                //typeFilter: { xtype: 'combo', value: 'SKU', hidden: true},
                websiteFilter: {hidden: true}

            },
            bbarCfg: {
                btnConfirm: {
                    iconCls: 'icon_agree',
                    handler: function () {
                        var window = this.ownerCt.ownerCt;
                        var records = this.ownerCt.ownerCt.getSelection();
                        var addProductId = [];
                        for (var i = 0; i < records.length; i++) {
                            addProductId.push(records[i].getId());
                        }
                        if (records.length > 0) {
                            JSAjaxRequest(adminPath + 'api/partners/' + id + '/products/', "POST", false,
                                addProductId, null, function (require, success, response) {
                                    if (success) {
                                        Ext.Msg.alert('提示', '添加成功!', function callback() {
                                            store.load();
                                            window.close();
                                        });
                                    }
                                })
                        } else {
                            window.close();
                        }
                    }
                },

                btnCancel: {
                    hidden: true
                }
            },
            partnerId: id,
            /*
             filterDate: store.data.items,
             */
            websiteId: websiteId,
            grid: {},
            gridCfg: {
                viewConfig: {
                    enableTextSelection: true//设置grid中的文本可以选择
                },
                store: Ext.create('CGP.common.productsearch.store.PartnerOptionalProductStore')
            }
        });
        wind.show();
    },
    /**
     * 批量删除记录
     * @param me 当前的window
     */
    deleteSelectProducts: function (me) {
        {
            var view = me.grid.getView();
            var selected = me.grid.getSelectionModel().getSelection();
            var keys = Ext.Array.slice(me.grid.getSelectionModel().selected.keys);
            if (keys.length > 0) {
                Ext.MessageBox.confirm(i18n.getKey('prompt'), '是否删除选中的产品?', function (btn) {
                    if (btn == 'yes') {
                        if (!Ext.isEmpty(keys))
                            view.loadMask.show();
                        var store = me.grid.getStore();
                        var requestConfig = {
                            url: adminPath + 'api/partners/' + me.partnerId + '/products/?productIds=' + keys,
                            method: 'DELETE',
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            success: function (response) {
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                if (responseMessage.success) {
                                    Ext.each(keys, function (key) {
                                        store.remove(store.getById(key));
                                    }, this);
                                    view.loadMask.hide();
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));
                                    store.load();
                                } else {
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }
                            },
                            failure: function (response) {
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                            }
                        }
                        Ext.Ajax.request(requestConfig);
                    }
                })
            }
        }
    },
    /**
     *  列中删除单条记录
     * @param me 当前这个window的对象
     * @param record 当前的记录
     */
    deleteSelect: function (me, record) {
        Ext.MessageBox.confirm(i18n.getKey('prompt'), '是否删除该产品?', callBack);

        function callBack(id) {
            //var selected = me.getSelectionModel().getSelection();
            if (id === "yes") {
                var requestConfig = {
                    url: adminPath + 'api/partners/' + me.partnerId + '/products/?productIds=' + record.get('id'),
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    success: function (response) {
                        var responseMessage = Ext.JSON.decode(response.responseText);
                        if (responseMessage.success) {
                            record.store.remove(record);
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));
                            me.grid.store.load();
                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                        }
                    },
                    failure: function (response) {
                        var responseMessage = Ext.JSON.decode(response.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }

                }
                Ext.Ajax.request(requestConfig);
            } else {
                close();
            }
        }
    },
    addFieldText: function (records, page, me, store) {
        var arr = [];
        //预期写定的标签name
        var keyhead = 'PARTNER_' + me.partnerId;
        var myLabelkey = [
            {
                title: "额外属性",
                key: keyhead + '_CONFIG_KEY_ORDER_EXTRA_PARAM_RT_TYPE'
            },
            {
                title: "partner default currency",
                key: keyhead + '_CONFIG_KEY_DEFAULT_CURRENCY'
            },
            {
                title: "partner default shipping method",
                key: keyhead + '_CONFIG_KEY_DEFAULT_SHIPPING_METHOD'
            },
            {
                title: "partner base currency",
                key: keyhead + '_CONFIG_KEY_BASE_CURRENCY'
            },
            {
                title: "partner address label",
                key: keyhead + '_CONFIG_KEY_REPORT_ADDRESSLABEL'
            }
        ];
        for (var j = 0; j < myLabelkey.length; j++) {
            var index = store.findBy(function (record) {
                return record.get('key') == myLabelkey[j].key;
            });
            if (index > -1) {
                var field = page.items.items[j];
                var value = store.getAt(index).get('value');
                var numberArray = [keyhead + '_CONFIG_KEY_BASE_CURRENCY', keyhead + '_CONFIG_KEY_DEFAULT_CURRENCY'];
                if (Ext.Array.contains(numberArray, store.getAt(index).get('key'))) {
                    if (field.name == 'RtType' && !Ext.isEmpty(value)) {
                        field.setInitialValue([parseInt(value)]);
                    } else {
                        field.setValue(parseInt(value));
                    }
                } else {
                    if (field.name == 'RtType' && !Ext.isEmpty(value)) {
                        field.setInitialValue([value]);
                    } else {
                        field.setValue(value);
                    }
                }
            } else {
                var field = page.items.items[j];
                field.setValue('');
            }
        }
    },
    /**
     * 订单提醒配置
     * @param id
     * @param websiteId
     */
    orderNotifyConfig: function (id, websiteId) {
        JSOpen({
            id: 'orderNotifyConfig',
            url: path + 'partials/partner/orderNotifyConfig.html?id=' + id,
            title: i18n.getKey('orderNotify') + i18n.getKey('config') + '(' + i18n.getKey('partner') + i18n.getKey('id') + ':' + id + ')',
            refresh: true
        })
    },
    /**
     *  合作用户订单报表管理
     * @param id
     * @param websiteId
     */
    partnerOrderReportConfigManage: function (id, websiteId) {
        JSOpen({
            id: 'partnerOrderReportConfigManage',
            url: path + 'partials/partnerorderreportconfigmanage/partnerOrderReportConfigManage.html?partnerId=' + id + '&websiteId=' + websiteId,
            title: i18n.getKey('partnerOrderReportConfigManage') + '(' + i18n.getKey('partner') + i18n.getKey('id') + ':' + id + ')',
            refresh: true
        })
    },
    /**
     * 查看生产商的支持产品
     * @param id
     * @param websiteId
     */
    checkSupportableProduct: function (id, websiteId) {
        JSOpen({
            id: 'supportableProduct',
            url: path + 'partials/partner/partnersupportableproduct/supportableproduct.html?partnerId=' + id + '&websiteId=' + websiteId,
            title: i18n.getKey('check') + i18n.getKey('supportableProduct'),
            refresh: true
        })
    },
    /**
     * 编辑viewconf的弹窗
     * @param partnerId
     * @param websiteId
     */
    editViewConfigWindow: function (partnerId, websiteId) {
        var partnerViewConfig = '';
        url = adminPath + 'api/partners/' + partnerId + '/viewConfig';
        Ext.Ajax.request({
            url: url,
            method: 'GET',
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                partnerViewConfig = Ext.JSON.decode(response.responseText).data;
            }
        });
        showWindow = function () {
            var method = Ext.isEmpty(partnerViewConfig) ? 'POST' : 'PUT';
            var win = Ext.create('Ext.window.Window', {
                title: i18n.getKey('compile') + '_' + i18n.getKey('viewConfig'),
                height: 800,
                width: 800,
                modal: true,
                layout: 'fit',
                items: {
                    xtype: 'form',
                    itemId: 'form',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'textarea',
                            flex: 1,
                            width: '100%',
                            fieldStyle: 'border-bottom: #000000 0px solid;',
                            allowBlank: false,
                            value: Ext.isEmpty(partnerViewConfig) ? null : JSON.stringify(partnerViewConfig, null, "\t"),
                            itemId: 'partnerViewConfig'
                        }
                    ]
                },
                bbar: {
                    items: ['->', {
                        xtype: 'button',
                        text: i18n.getKey('save'),
                        iconCls: 'icon_agree',
                        handler: function (view) {
                            var form = view.ownerCt.ownerCt.getComponent('form');
                            if (form.isValid()) {
                                var partnerViewConfig = form.getComponent('partnerViewConfig').getValue();
                                try {
                                    partnerViewConfig = JSON.parse(partnerViewConfig);
                                } catch (e) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('illlegal json'));
                                    return;
                                }
                                partnerViewConfig.clazz = 'com.qpp.cgp.domain.product.config.view.ViewConfig';
                                Ext.Ajax.request({
                                    method: method,
                                    url: adminPath + 'api/partners/' + partnerId + '/viewConfig',
                                    headers: {
                                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                    },
                                    jsonData: partnerViewConfig,
                                    success: function (response) {
                                        var responseMessage = Ext.JSON.decode(response.responseText);
                                        if (responseMessage.success) {
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                                            win.close();
                                        } else {
                                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                        }
                                    },
                                    failure: function (response) {
                                        var responseMessage = Ext.JSON.decode(response.responseText);
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                    }
                                });
                            } else {
                                Ext.Msg.alert(i18n.getKey('prompt'), '内容不予许为空')
                            }
                        }
                    }, {
                        xtype: 'button',
                        iconCls: "icon_cancel",
                        text: i18n.getKey('cancel'),
                        handler: function () {
                            win.close();
                        }
                    }]
                }
            });
            win.show();
        }
        if (Ext.isEmpty(partnerViewConfig)) {
            Ext.Msg.confirm(i18n.getKey('prompt'), '当前的viewConfig为空，是否新建该配置？', function (select) {
                if (select == 'yes') {
                    Ext.Ajax.request({
                        url: adminPath + 'api/partners/' + partnerId + '/viewConfig',
                        method: 'POST',
                        async: false,
                        headers: {
                            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                        },
                        jsonData: {
                            clazz: 'com.qpp.cgp.domain.product.config.view.ViewConfig'

                        },
                        success: function (response) {
                            partnerViewConfig = Ext.JSON.decode(response.responseText).data;
                            showWindow();
                        }
                    })
                } else {
                    return;
                }
            })
        } else {
            showWindow();
        }
    },
    /**
     * 供应商订单状态改变时的邮件通知配置
     * @param id
     * @param websiteId
     */
    supplierOrderStatusChangeEmailNotifyConfig: function (id, websiteId) {
        JSOpen({
            id: 'managerOrderStatusChangeEmailNotify',
            url: path + 'partials/partner/supplierorderstatuschangeemailnotify/orderstatuschangeemailnotify.html?partnerId=' + id + '&websiteId=' + websiteId,
            title: i18n.getKey('manager') + i18n.getKey('orderStatusChangeEmailNotifyConfig'),
            refresh: true
        })
    },
    /**
     * 共有配置下的发送邮箱配置
     * @param partnerId
     * @param websiteId
     */
    manageSendMailConfig: function (partnerId, websiteId) {
        JSOpen({
            id: 'manageSendMailConfig',
            url: path + 'partials/partner/sendmailconfig/sendmailconfig.html?partnerId=' + partnerId + '&websiteId=' + websiteId,
            title: i18n.getKey('sendMailCfg'),
            refresh: true
        })
    },
    /**
     * 基础货币配置
     * @param partnerId
     * @param websiteId
     */
    baseCurrencyConfig: function (partnerId, websiteId) {
        var configRecord = null;
        CGP.partner.model.SalerConfigModel.getProxy();
        CGP.partner.model.SalerConfigModel.proxy.url = adminPath + 'api/partners/' + partnerId + '/salerConfig';
        CGP.partner.model.SalerConfigModel.load('', {
            scope: this,
            failure: function (record, operation) {
            },
            success: function (record, operation) {
                configRecord = record;
                baseCurreny.setValue(record.get('baseCurrency'));

            },
            callback: function (record, operation) {
            }
        });
        var baseCurreny = Ext.widget('combo', {
            store: Ext.create("CGP.currency.store.Currency", {
                proxy: {
                    type: 'uxrest',
                    extraParams: {filter: '[{"name":"website.id","value":' + websiteId + ',"type":"number"}]'},
                    isRepeat: true,
                    url: adminPath + 'api/currencies',
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    reader: {
                        type: 'json',
                        root: 'data.content'
                    }
                }
            }),
            fieldLabel: i18n.getKey('base') + i18n.getKey('currency'),
            allowBlank: false,
            editable: false,
            displayField: 'title',
            valueField: 'id'
        });
        var win = Ext.create('Ext.window.Window', {
            title: i18n.getKey('base') + i18n.getKey('currency'),
            height: 150,
            width: 400,
            modal: true,
            layout: 'fit',
            items: [
                {
                    xtype: 'form',
                    border: false,
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'

                    },
                    defaults: {
                        width: 350
                    },
                    items: [baseCurreny],
                    bbar: [
                        '->', {
                            xtype: 'button',
                            iconCls: 'icon_save',
                            text: i18n.getKey('save'),
                            handler: function () {
                                if (baseCurreny.isValid()) {
                                    configRecord.set('baseCurrency', baseCurreny.getValue());
                                    var salerDeliveryAddress = configRecord.get('salerDeliveryAddress');
                                    salerDeliveryAddress.clazz = 'com.qpp.cgp.domain.partner.config.SalerDeliveryAddress';
                                    configRecord.set('salerDeliveryAddress', salerDeliveryAddress);
                                    configRecord.save({
                                        callback: function (records, opt, success) {
                                            if (success) {
                                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('save') + i18n.getKey('success'));
                                                win.close();
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    ]
                }
            ]
        });
        win.show();
    },
    /**
     * 生产配置
     * @param partnerId
     * @param websiteId
     */
    produceConfig: function (partnerId, websiteId) {
        var configRecord = null;
        CGP.partner.model.SalerConfigModel.getProxy();
        CGP.partner.model.SalerConfigModel.proxy.url = adminPath + 'api/partners/' + partnerId + '/salerConfig';
        CGP.partner.model.SalerConfigModel.load('', {
            scope: this,
            failure: function (record, operation) {
            },
            success: function (record, operation) {
                configRecord = record;
                var form = win.getComponent('form');
                for (var i = 0; i < form.items.items.length; i++) {
                    var value = record.get(form.items.items[i].getName());
                    form.items.items[i].setValue(value);
                }
            },
            callback: function (record, operation) {
            }
        });
        var customAddressLabel = Ext.widget('textfield', {
            itemId: 'customAddressLabel',
            name: 'customAddressLabel',//与模型中的字段相同
            fieldLabel: i18n.getKey('addressLabel'),
            allowBlank: true
        });
        var win = Ext.create('Ext.window.Window', {
            title: i18n.getKey('produce') + i18n.getKey('config'),
            height: 150,
            width: 400,
            modal: true,
            layout: 'fit',
            items: [
                {
                    xtype: 'form',
                    border: false,
                    itemId: 'form',
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'

                    },
                    defaults: {
                        allowBlank: false,
                        width: 350
                    },
                    items: [customAddressLabel],
                    bbar: [
                        '->', {
                            xtype: 'button',
                            iconCls: 'icon_save',
                            text: i18n.getKey('save'),
                            handler: function (view) {
                                var form = view.ownerCt.ownerCt;
                                if (form.isValid()) {
                                    for (var i = 0; i < form.items.items.length; i++) {
                                        configRecord.set(form.items.items[i].getName(), form.items.items[i].getValue());
                                    }
                                    var salerDeliveryAddress = configRecord.get('salerDeliveryAddress');
                                    salerDeliveryAddress.clazz = 'com.qpp.cgp.domain.partner.config.SalerDeliveryAddress';
                                    configRecord.set('salerDeliveryAddress', salerDeliveryAddress);
                                    configRecord.save({
                                        callback: function (records, opt, success) {
                                            if (success) {
                                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('save') + i18n.getKey('success'));
                                                win.close();
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    ]
                }
            ]
        });
        win.show();
    },
    /**
     * 下单配置
     * @param partnerId
     * @param websiteId
     */
    placeOrderConfig: function (partnerId, websiteId) {
        JSOpen({
            id: 'placeOrderConfig',
            url: path + 'partials/partner/placeorderconfig/placeOrderConfig.html?partnerId=' + partnerId + '&websiteId=' + websiteId,
            title: i18n.getKey('placeOrderConfig'),
            refresh: true
        })
    },
    /**
     *订单通知邮件配置
     * @param partnerId
     * @param websiteId
     *  @param type 标识为供应商
     */
    orderstatuschangenotifyconfig: function (partnerId, websiteId, type) {
        JSOpen({
            id: 'orderstatuschangenotifyconfig',
            url: path + 'partials/partner/orderstatuschangenotifyconfig/orderstatuschangenotifyconfig.html?partnerId=' + partnerId + '&websiteId=' + websiteId + '&type=' + type,
            title: i18n.getKey('orderStatusChangeEmailNotifyConfig'),
            refresh: true
        })
    },
    /**
     *供应商订单配置
     * @param partnerId
     * @param websiteId
     */
    supplierOrderConfig: function (partnerId, websiteId, type) {
        JSOpen({
            id: 'supplierOrderConfig',
            url: path + 'partials/partner/supplierorderconfig/supplierorderconfig.html?partnerId=' + partnerId + '&websiteId=' + websiteId + '&type=' + type,
            title: i18n.getKey('supplier') + i18n.getKey('order') + i18n.getKey('config'),
            refresh: true
        })
    },
    /**
     * 查看生产商的支持产品V2
     * @param id
     * @param websiteId
     */
    checkSupportableProductV2: function (id, websiteId) {
        JSOpen({
            id: 'supportableProductV2',
            url: path + 'partials/partner/suppliersupportableproduct/suppliersupportableproduct.html?partnerId=' + id + '&websiteId=' + websiteId,
            title: i18n.getKey('supportableProduct') + i18n.getKey('manager'),
            refresh: true
        })
    },
    /**
     * 显示电商可以使用的产品列表
     * @param {Number} partnerId 合作伙伴ID
     * @param {Number} websiteId 网站ID
     */
    showEcommerceEnabelProductManageWin: function (partnerId, websiteId, websiteName) {
        var me = this;
        JSOpen({
            id: 'EnabelProductManagePage',
            url: path + 'partials/partner/ecommerceenableproduct/ecommerceenableproduct.html?partnerId=' + partnerId + '&websiteId=' + websiteId,
            title: i18n.getKey('enabelProductManage'),
            refresh: true
        });
    },

    //查询
    getQuery: function (url) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        })
        return data;
    },

    //删除
    deleteQuery: function (url, callFn) {
        JSAjaxRequest(url, 'DELETE', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    callFn()
                }
            }
        }, false)
    },

    //异步修改存在加载动画
    asyncEditQuery: function (url, jsonData, isEdit, callFn, msg) {
        var method = isEdit ? 'PUT' : 'POST';

        JSAjaxRequest(url, method, true, jsonData, msg, callFn, true);
    },

    /**
     * 查看用户授权信息
     * @param store  需展示的store
     * @param callBack 回调
     */
    createCheckUserAuthInfoGridWindow: function (store, callBack) {
        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('查看_用户授权信息'),
            width: 800,
            height: 400,
            items: [
                {
                    xtype: 'searchcontainer',
                    name: 'searchcontainer',
                    itemId: 'searchcontainer',
                    filterCfg: {
                        hidden: true,
                        minHeight: 60,
                        layout: {
                            type: 'table',
                            columns: 3
                        },
                        defaults: {
                            isLike: false
                        },
                        /*searchActionHandler: function (btn) { //重写本地查询
                            var me = this,
                                form = me.ownerCt.ownerCt,
                                searchcontainer = form.ownerCt,
                                store = searchcontainer.grid.store,
                                filterData = form.getQuery()

                            if (filterData.length) {
                                store.proxy.data = controller.getFilteredValues(filterData, storeData);
                            } else {
                                store.proxy.data = storeData;
                            }
                            store.load();
                        },*/
                        items: [
                            {
                                xtype: 'textfield',
                                name: '_id',
                                itemId: 'id',
                                fieldLabel: i18n.getKey('id'),
                            },
                            {
                                xtype: 'textfield',
                                name: 'name',
                                itemId: 'name',
                                fieldLabel: i18n.getKey('name'),
                            },
                            {
                                xtype: 'textfield',
                                name: 'displayName',
                                fieldLabel: i18n.getKey('displayName'),
                                itemId: 'displayName'
                            },
                        ]
                    },
                    gridCfg: {
                        editAction: false,
                        deleteAction: false,
                        store: store,
                        selModel: {
                            selType: 'rowmodel',
                        },
                        columnDefaults: {
                            tdCls: 'vertical-middle',
                            align: 'center',
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip ="' + value + '"';
                                return value
                            }
                        },
                        editActionHandler: function (grid, rowIndex, colIndex) {
                        },
                        deleteActionHandler: function (view, colIndex, rowIndex, el, event, record, dom) {
                        },
                        pagingBar: false,
                        tbar: {
                            hidden: true,
                            items: [],
                        },
                        columns: [
                            {
                                text: i18n.getKey('授权类型'),
                                dataIndex: 'authTypeValue',
                                width: 180,
                            },
                            {
                                text: i18n.getKey('值'),
                                dataIndex: 'displayValue',
                                flex: 1,
                            },
                        ]
                    }
                }
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;

                        callBack && callBack();
                        win.close();
                    }
                }
            },
        }).show();
    },
});
