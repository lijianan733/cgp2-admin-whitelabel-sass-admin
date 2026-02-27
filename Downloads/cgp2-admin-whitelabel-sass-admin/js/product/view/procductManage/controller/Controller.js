/**
 * Controller
 * @Author: miao
 * @Date: 2022/2/22
 */
Ext.define('CGP.product.view.procductManage.controller.Controller', {
    modifyProductMode: function (configurableId, button) {
        var form = {
            xtype: 'form',
            border: false,
            padding: '20',
            items: [
                {
                    xtype: 'combo',
                    itemId: 'mode',
                    width: 250,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [
                            {name: '测试', value: 'TEST'},
                            {name: '正式', value: 'RELEASE'}
                        ]
                    }),
                    displayField: 'name',
                    valueField: 'value',
                    value: 'RELEASE',
                    name: 'productMode',
                    fieldLabel: i18n.getKey('productMode'),
                    allowBlank: false,
                    msgTarget: 'side'
                }
            ]
        };
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('choice') + i18n.getKey('productMode'),
            modal: true,
            width: 350,
            layout: 'fit',
            height: 150,
            bbar: ['->', {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                itemId: 'confirm',
                handler: function () {
                    var win = this.ownerCt.ownerCt;
                    var form = win.down('panel');
                    var modeValue = form.getComponent('mode').getValue();
                    if (form.isValid()) {
                        Ext.Ajax.request({
                            url: adminPath + 'api/products/' + configurableId + '/mode?mode=' + modeValue,
                            method: 'PUT',
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            success: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                if (response.success) {
                                    var prompt = button.ownerCt.getComponent("prompt");
                                    win.close();
                                    prompt.show();
                                } else {
                                    win.close();
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                }
                            },
                            failure: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                var prompt = button.ownerCt.getComponent("prompt");
                                prompt.setValue("<div>" + i18n.getKey('failure') + ":" + response.data.message + "</div>");
                                win.close();
                                prompt.show();
                            }
                        });
                    }

                }
            }, {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                itemId: 'cancel',
                handler: function () {
                    var win = this.ownerCt.ownerCt;
                    win.close();
                }
            }],

            items: [form]
        }).show();

    },
    toggleLockStyle:function (button,lockStatus){
        var me=this;
        var isLock=lockStatus??(button.value=='lock');
        button.setText(i18n.getKey(isLock?'unlock':'lock')+i18n.getKey('product') + i18n.getKey('config'));
        button.setIconCls(isLock?'icon_unlock':'icon_lock');
        var isProductManager=Ext.getCmp("tabProcductManage").isProductManager;
        me.toggleDisabled(["btnProductMode","btnSyncProductConfig","btnSyncCustomsEl","btnSyncProduct"],isProductManager,isLock);

        button.value = isLock?'unlock':'lock';
    },

    toggleDisabled:function (comps,isProductManager,disabled ){
        if(Ext.isEmpty(comps)){
            return false;
        }
        if(Ext.isArray(comps)){
            comps.forEach(function (item){
                var comp=Ext.getCmp(item);
                comp.setDisabled(!isProductManager||disabled);
            })
        }
        else {
            var comp=Ext.getCmp(comps);
            comp.setDisabled(disabled);
        }
    },

    lockProductConfig: function (configurableId, button) {
        var me=this;
        var status = {
            lock: '锁定',
            unlock: '解除锁定'
        };
        // var lockButton = this.getComponent('Container3').getComponent('lockProductConfig');
        Ext.Msg.confirm(i18n.getKey('prompt'), '是否将产品配置' + status[button.value] + '？', function (select) {
            if (select == 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/productlockconfigs/' + button.value + '/' + configurableId,
                    method: 'PUT',
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    success: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        var isLock = response.data.isLock;
                        if (response.success) {
                            Ext.util.Cookies.set(configurableId + '_isLock', isLock, null, '/' + top.pathName);
                            me.toggleLockStyle(button);
                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        }
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        var prompt = button.ownerCt.getComponent("prompt");
                        prompt.setValue("<div>" + i18n.getKey('failure') + ":" + response.data.message + "</div>");
                        prompt.show();
                    }
                });
            }
        })

    },
    syncProductConfig: function (configurableId, button) {
        Ext.Msg.confirm(i18n.getKey('prompt'), '是否将产品的最新版本配置修改为上线状态，并同步到SKU产品同版本配置中？', function (select) {
            if (select == 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/productConfigs/status/latest/products/' + configurableId,
                    method: 'PUT',
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    success: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        if (response.success) {
                            var prompt = button.ownerCt.getComponent("prompt");
                            prompt.show();
                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        }
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        var prompt = button.ownerCt.getComponent("prompt");
                        prompt.setValue("<div>" + i18n.getKey('failure') + ":" + response.data.message + "</div>");
                        prompt.show();
                    }
                });
            }
        })

    },
    syncElements:function (containerPanel){
        var lask = containerPanel.setLoading();
        var productId = containerPanel.configurableId;
        var requestConfig = {
            url: adminPath + 'api/products/' + productId + '/syncCustomsElement',
            method: 'PUT',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                if (!response.success) {
                    lask.hide();
                    Ext.Msg.alert(i18n.getKey('info'), response.data.message);
                } else {
                    lask.hide();
                    Ext.Msg.alert(i18n.getKey('prompt'), '同步成功！');
                }

            },
            failure: function (resp) {
                lask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        };
        Ext.Ajax.request(requestConfig);
    },
    syncProductData:function (product,progressContainer){
        var productList=[];
        productList.push(product);
        Ext.create('CGP.product.view.syncproduct.InputFormWin', {
            singleProduct:true,
            productList: productList,
            progressContainer: progressContainer
        })
    },

    getProductManagers: function (productManagerTab) {

        var method = 'GET',
            url = adminPath + 'api/productAdministratorConfigs?productId=' + productManagerTab.productId;

        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            async: false,
            jsonData: null,
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    productManagerTab.setValue(resp.data);
                } else {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('dataFailure') + resp.data.message,)
                    var task = new Ext.util.DelayedTask(function (){
                        productManagerTab.ownerCt.ownerCt.close();
                    });
                    task.delay(500);

                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('requestFailed') + object.data.message);
            },
            callback: function () {

            }
        });
    },
    saveProductManagerConfig: function (productManagerTab) {
        if (!productManagerTab.isValid()) {
            return false;
        }
        var wind=productManagerTab.ownerCt
        var url = adminPath + 'api/productAdministratorConfigs', method = 'POST';
        var callback = function (require, success, response) {
            var resp = Ext.JSON.decode(response.responseText);
            if (resp.success) {
                wind.close();
            }
            else{
                Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
            }
        };

        var data = productManagerTab.getValue();
        if (data._id) {
            method = 'PUT';
            url += '/' + data._id;
        }
        if (!data?._id || data.productAdministratorInfos.length < 1) {
            var corrUser = Ext.JSON.decode(Ext.util.Cookies.get("user"))
            var containCorrUser=false;
            for(var item of data.productAdministratorInfos){
                if(item.email==corrUser.email){
                    containCorrUser=true;
                    break;
                }
            }
            if(!containCorrUser){
                data.productAdministratorInfos.push({email: corrUser.email});
            }
        }
        data.productAdministratorInfos = data.productAdministratorInfos.concat(users);
        JSAjaxRequest(url, method, true, data, i18n.getKey('add') + i18n.getKey('success'), callback);
    },



    addProductManager: function (userComp) {

        var me = this;
        var wind = Ext.create('Ext.ux.window.SuperWindow', {
            width: 900,
            height: 500,
            bodyPadding: 0,
            title: i18n.getKey('productManager')+i18n.getKey('add'),
            items: [
                Ext.create('CGP.product.view.procductManage.view.UserList', {
                    itemId: 'userList',
                    setedUsers: userComp.compValue||[]
                })
            ],
            confirmHandler: function (btn) {
                var wind = btn.ownerCt.ownerCt;
                var userGrid = wind.getComponent('userList').grid;
                var userSelected = userGrid.getSelectionModel().getSelection();
                if (userSelected.length < 1) {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('至少选择一个用户！'));
                    return false;
                }
                var dataSelected = [];
                userSelected.forEach(function (record) {
                    // dataSelected.push({email: record.get('email'), userId: record.get('id')});
                    dataSelected.push({email: record.get('email')});
                });
                me.saveProductManager(userComp, dataSelected, wind);

            }
        }).show();
    },

    saveProductManager: function (userComp, users, wind) {
        var me=this;
        var productManagerTab = userComp.ownerCt;
        var url = adminPath + 'api/productAdministratorConfigs', method = 'POST';
        var data = productManagerTab.getValue();
        if (data._id) {
            method = 'PUT';
            url += '/' + data._id;
        }
        if (!data?._id || data.productAdministratorInfos.length < 1) {
            var user = Ext.JSON.decode(Ext.util.Cookies.get("user"));
            var notExist=true;
            for(var item of users){
                if(item.email==user.email){
                    notExist=false;
                    break;
                }
            }
            if(notExist){
                users=Ext.Array.insert(users,0,[{email: user.email, userId: user.userId}]);
            }
        }
        data.productAdministratorInfos = data.productAdministratorInfos.concat(users);

        var succfn=function (response, options) {
            var resp = Ext.JSON.decode(response.responseText);
            if (resp.success) {
                productManagerTab.setValue(resp.data);
                wind.close();
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('add') + i18n.getKey('success'));
            }
        };
        me.commitProductManager(url,method,data,succfn);
    },

    commitProductManager:function (url,method,data,succfn){
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            async: true,
            jsonData: data,
            success: succfn,
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            },
            callback: function () {

            }
        });
    },
    deleteManager: function (userComp, email, display) {
        var me=this;
        var productManagerTab = userComp.ownerCt;
        var data = productManagerTab.getValue();
        var url = adminPath + 'api/productAdministratorConfigs/' + data._id, method = 'PUT';

        if (data?.productAdministratorInfos && data.productAdministratorInfos.length > 0) {
            data.productAdministratorInfos.forEach(function (item, index) {
                if(item.email==email){
                    Ext.Array.remove(data.productAdministratorInfos,item);
                }
            });
        }
        var succfn=function (response, options) {
            var resp = Ext.JSON.decode(response.responseText);
            if (resp.success) {
                productManagerTab.setValue(resp.data);
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('delete') + i18n.getKey('success'));
            }
            else{
                Ext.Msg.alert(i18n.getKey('info'), resp.data.message);
            }
        };
        me.commitProductManager(url,method,data,succfn);
    }
});
