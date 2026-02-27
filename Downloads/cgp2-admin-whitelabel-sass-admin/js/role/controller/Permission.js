Ext.define("CGP.role.controller.Permission", {
    mixins: ['Ext.ux.util.ResourceInit'],
    requires: ["CGP.role.view.permission.Window"],

    permissionWindow: null, //保存一个权限窗体


    constructor: function () {
        var me = this;

        me.callParent(arguments);
    },
    openPermissionWindow: function (record) {
        var me = this;
        me.permissionWindow = Ext.create("CGP.role.view.permission.Window", {
            title: i18n.getKey('setPermission') + ":" + record.get('description'),
            record: record,
            controller: me,
            saveButtonFun: me.savePermission
        });

        me.permissionWindow.show();
    },

    savePermission: function () {
        var me = this;
        var window = me.permissionWindow;
        permissions = window.permissionTree.getArrayValue();
        permissions = permissions.concat(window.groupTree.getArrayValue());

        //当permissions是空的时候，这样才能将空值传到接口中。
        //下面的params当permissions是空的时候忽略不记。
        var paramsStr = "";
        if (Ext.isEmpty(permissions)) {
            paramsStr = "&permissions=";
        }

        var requestParam = {
            url: adminPath + 'api/permissions?access_token=' + Ext.util.Cookies.get('token') + paramsStr,
            method: 'POST',
            params: {role: window.record.get("id"), permissions: permissions},
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                if (Ext.decode(resp.responseText).success) {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('savesuccess') + '!');
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        };
        Ext.Ajax.request(requestParam);
    }
});




