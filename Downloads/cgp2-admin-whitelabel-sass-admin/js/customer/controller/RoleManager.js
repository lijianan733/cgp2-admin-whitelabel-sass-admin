Ext.define("CGP.customer.controller.RoleManager", {
    mixins: ["Ext.ux.util.ResourceInit"],
    requires: ["CGP.customer.view.rolemanager.SetRole", "CGP.customer.view.rolemanager.ShowRole"],

    setRoleWindow: null, //设置角色的窗体
    showRoleWindow: null, //显示角色窗体


    constructor: function () {
        var me = this;

        this.callParent(arguments);
    },

    openShowRoleWindow: function (record) {
        var me = this;
        if (Ext.isEmpty(me.showRoleWindow)) {
            me.showRoleWindow = Ext.create("Ext.window.Window", {
                width: 400,
                closeAction: 'hide',
                modal: true,
                title: i18n.getKey('checkRole') + " " + record.get('email'),
                height: 400,
                closable: true,
                items: [
                    {
                        xtype: 'showrole',
                        record: record,
                        controller: me
                    }
                ],
                listeners: {
                    beforeclose: function (win) {
                        if (!Ext.isEmpty(me.setRoleWindow))
                            me.setRoleWindow.close();
                    }
                }
            });
        } else {
            me.showRoleWindow.setTitle(i18n.getKey('checkRole') + " " + record.get('email'));
            var grid = me.showRoleWindow.child("showrole");
            grid.refresh(record);
        }
        me.showRoleWindow.show();
    },

    openSetRoleWindow: function (record, store) {
        var me = this;
        if (Ext.isEmpty(me.setRoleWindow)) {
            me.setRoleWindow = Ext.create('CGP.customer.view.rolemanager.SetRole', {
                record: record,
                store: store,
                controller: me
            });
        } else {
            me.setRoleWindow.refresh(record, store);
        }
        me.setRoleWindow.show();
    },

    deleteRole: function (grid, rowIndex, colIndex) {
        var me = this;

//		var grid = me.showRoleWindow.child("showrole");
        var store = grid.getStore();
        var record = me.showRoleWindow.child("showrole").record;
        var userId = record.get('id');
        var targetRoleId = store.getAt(rowIndex).get('id');
        Ext.MessageBox.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (btn) {
            if (btn == 'yes') {
                grid.loadMask.show();
                var deleteRoleCfg = {
                    url: adminPath + 'api/userRoles?roleId=' + targetRoleId + '&customerId=' + userId + '&access_token=' + Ext.util.Cookies.get('token'),
                    method: 'DELETE',
                    callback: function (o, s, r) {
                        store.removeAt(rowIndex);
                        grid.loadMask.hide();
                        if (me.setRoleWindow && (!me.setRoleWindow.isHidden())) {
                            me.openSetRoleWindow(record, store);
                        }
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));
                    }
                };
                Ext.Ajax.request(deleteRoleCfg);
            }
        });
    },

    //修改某用户的角色
    saveRole: function () {
        var me = this;
        var array = me.setRoleWindow.array;
        var record = me.showRoleWindow.child("showrole").record;
        record.set("roles", array);
        record.save({
            success: function (rep, action) {
                arguments;
                me.setRoleWindow.close();
                me.openShowRoleWindow(record);
            }
        });
    },
    /**
     * 修改客户密码的方法
     * @param {Number} customerId 客户ID
     * @param {Object} data 修改密码的表单数据
     * @param {CGP.customer.view.modifypassword.ModifyPassword} win 修改密码的窗口
     */
    modifyPassword: function (customerId, data, win) {
        if (data['confirmPwd'] != data['newPassword']) {
            win.form.getComponent('confirmPwd').markInvalid('密码输入不一致！');
        } else {
            var loadMask = win.setLoading(true);
            Ext.Ajax.request({
                url: adminPath + 'api/users/' + customerId + '/resetPassword',
                jsonData: {'newPassword': data['newPassword']},
                method: 'PUT',
                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                success: function (resp) {
                    loadMask.hide();
                    var response = Ext.JSON.decode(resp.responseText);
                    if (response.success == true) {
                        Ext.Msg.alert('提示', '修改成功！', function closeWin() {
                            win.close();
                        });
                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), '修改失败，错误信息:' + response.data.message);
                    }
                },
                failure: function (resp) {
                    loadMask.hide();
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            });
        }
    },
    /**
     * 创建修改密码的窗口
     * @param {Model} record 选中行的记录
     */
    showModifyPasswordWin: function (record) {
        var me = this;
        var customerId = record.get('id');
        Ext.create('CGP.customer.view.modifypassword.ModifyPassword', {
            controller: me,
            customerId: customerId
        }).show();
    },
    /**
     *设置访问控制的窗口
     * @param userId
     */
    showAccessControllWin: function (userId, userIdArray) {
        if (Ext.isEmpty(userIdArray)) {
            userIdArray = [userId]
        }
        var win = Ext.create('CGP.customer.view.accesscontroller.SetAccessControllWindow', {
            userId: userId,
            userIdArray: userIdArray
        });
        win.show();
    }
})