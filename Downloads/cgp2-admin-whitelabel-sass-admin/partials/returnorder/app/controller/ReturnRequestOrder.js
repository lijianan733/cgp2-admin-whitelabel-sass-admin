/**
 * ReturnRequestOrder
 * @Author: miao
 * @Date: 2021/12/27
 */
Ext.define('CGP.returnorder.controller.ReturnRequestOrder', {
    extend: 'Ext.app.Controller',
    requires: [
        "CGP.returnorder.common.UserCombo"
    ],
    stores: [
        'ReturnRequestOrder',
        // 'StateInstance'
    ],
    models: ['ReturnRequestOrder'],
    views: [
        "state.StateForm",
        "state.entity.ReturnRequestOrderForm",
        "state.ActionLog",
        "state.ActionRemark",
        "state.ProductInfor"
    ],
    init: function () {
        this.control({
            'viewport grid button[itemId=createbtn]': {
                click: this.editRGB
            }
        });
    },
    editRGB: function (btn) {

    },

    /**
     *
     * @param id
     * @param actionComp
     */
    setActions: function (id, actionComp) {
        var me = this;
        var actionUrl = adminPath + 'api/partner/flowInstances/entity/'+id+'/stateInstances/current/actions',
            method = 'GET';
        actionComp.removeAll();
        var actionSucc = function (response) {
            var resp = Ext.JSON.decode(response.responseText);
            if (resp.success) {
                if (resp.data && Ext.isArray(resp.data)) {
                    for(var i=0; i<resp.data.length;i++){
                        var item=resp.data[i];
                        if(item.key=='COMMIT_EXPRESS_INFO'){
                            continue;
                        }
                        var actionBtn = {
                            xtype: 'button',
                            text: i18n.getKey(item.name||item.key),
                            margin: '10',
                            currAction:item,
                            handler: function (btn) {
                                me.setRemark(btn.currAction,id,actionComp);
                            }
                        }
                        actionComp.add(actionBtn);
                    }
                }
            } else {
                Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
            }
        };
        me.sendRequest(actionUrl, actionSucc, method);
    },

    sendRequest: function (url, succ, method,data) {
        var optins = {
            url: url,
            method: method,
            async: true,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData:data,
            success: succ,
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            },
            callback: function (require, success, response) {

            }
        };
        Ext.Ajax.request(optins);
    },

    setStateForm: function (id, stateForm) {
        var me = this;
        // var returnOrderUrl = adminPath + 'api/partner/orderItemReturnDTOs/' + id, method = 'GET';
        // var returnOrderSucc = function (response) {
        //     var resp = Ext.JSON.decode(response.responseText);
        //     if (resp.success) {
        //         if (resp.data?.content[0]) {
        //             stateForm.setValue(resp.data);
        //         }
        //     } else {
        //         Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
        //     }
        // };

        var logUrl = adminPath + 'api/partner/flowInstances/endity/' + id + '/stateInstances';
        var logSucc = function (response) {
            var resp = Ext.JSON.decode(response.responseText);
            if (resp.success) {
                if (resp.data && Ext.isArray(resp.data)) {
                    var wrapHis = [];
                    for (var index = resp.data.length - 1; index > 0; index--) {
                        var his, history = resp.data[index - 1];
                        his = '(' + (index + 1) + ')&nbsp;&nbsp;<font color=red>' + history.action?.name + '</font>' + '于' + '<font color=red>' + (Ext.isEmpty(history.createdDate) ? null : new Date(history.createdDate)) + '</font>' + '将此退货单状态修改为' + '<font color=red>' + history.state?.name + '</font>';
                        if (!Ext.isEmpty(history.remark)) {
                            his += '<spand style="color:red">[' + history.remark + ']<font/>'
                        }
                        if (!Ext.isEmpty(history.entityClazz) && !Ext.isEmpty(history.entityId)) {
                            his += '<a style="color: blue" onclick="' + me.checkEntity(history.entityClazz, history.entityId) + '">查看额外信息</a>'
                        }
                        if (index == (histories.length - 1)) {
                            his = '<p>' + his + '</p>'
                        } else {
                            his = '<p style="border-bottom:1px solid rgba(0,0,0,0.3)">' + his + '</p>';
                        }
                        wrapHis.push(his);
                    }
                    stateForm.getComponent('stateHistories').setValue('<div class="status-field">' + wrapHis.join('') + '</div>');
                }
            } else {
                Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
            }
        };
        var sendRequest = function (url, succ) {
            var optins = {
                url: url,
                method: method,
                async: true,
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: succ,
                failure: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                },
                callback: function (require, success, response) {

                }
            };
            Ext.Ajax.request(optins);
        };

        sendRequest(logUrl, logSucc);
    },

    setActionLog: function () {

    },

    setRemark: function (action,entityId,actionComp) {
        var me=this;
        Ext.create('Ext.ux.window.SuperWindow', {
            height: 300,
            title: i18n.getKey(action.name??action.key),
            confirmHandler: function (btn) {
                var wind = btn.ownerCt.ownerCt;
                var formComp = wind.getComponent('wform');
                if (!formComp.isValid()) {
                    return false;
                }
                var data ={actionKey:action.key};
                data=Ext.merge(formComp.getValue(),data);
                var url = adminPath + 'api/partner/flowInstances/entity/'+entityId+'/stateInstances', method = 'POST';

                var succ = function (response) {
                    var resp = Ext.JSON.decode(response.responseText);
                    if (resp.success) {
                        wind.close();
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('modifySuccess'));
                        me.setActions(entityId,actionComp);
                        actionComp.ownerCt.getComponent('actionLog').store.load();
                        var returnOrderModel = Ext.ModelManager.getModel("CGP.returnorder.model.ReturnRequestOrder");
                        returnOrderModel.load(parseInt(entityId), {
                            success: function (record, operation) {
                                actionComp.ownerCt.getComponent('returnInfor').setValue(record.data);
                            }
                        });
                    }
                    else{
                        Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                    }
                };
                me.sendRequest(url,succ,method,data)
            },
            items: [
                {
                    xtype: 'actionremark',
                    itemId: 'wform',
                    border: 0,
                    stateAction: action
                }
            ]
        }).show();
    },

    checkEntity: function (entityClazz, entityId) {
        var me=this;
        var entityName = entityClazz.substr(entityClazz.lastIndexOf('.') + 1)
        Ext.create('Ext.ux.window.SuperWindow', {
            height: 460,
            title: entityName,
            isView: true,
            items: [
                me.getEntityForm(entityClazz, entityId,true)
            ]
        }).show();
    },

    getEntityForm:function (entityClazz,entityId,isView){
        var entityName = entityClazz.substr(entityClazz.lastIndexOf('.') + 1)
        return Ext.create('CGP.returnorder.view.state.entity.' + entityName + 'Form',
            {
                entityId: entityId,
                border: 0,
                isView:isView,
                entityClazz:entityClazz
            }
        );
    }
});