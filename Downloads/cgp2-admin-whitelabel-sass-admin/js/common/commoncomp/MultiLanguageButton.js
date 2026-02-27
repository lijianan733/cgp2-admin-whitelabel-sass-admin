/**
 * @Description:
 * @author nan
 * @date 2023/8/8
 */
Ext.define('CGP.common.commoncomp.MultiLanguageButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.multilanguage_button',
    text: i18n.getKey('multilanguage'),
    iconCls: 'icon_multilangual',
    hidden: true,
    disabled: true,
    objectId: null,
    objectClazz: null,
    multiLanguageData: null,//指定配置的多语言配置需求
    btnAlwaysShow: false,//按钮一直显示,无需要进行接口判断
    handler: function (btn) {
        var clazz = btn.objectClazz.split('.').pop();
        JSOpen({
            id: 'edit' + '_multiLanguage',
            url: path + 'partials/multilanguage/main.html?objectClazz=' + btn.objectClazz + '&objectId=' + btn.objectId,
            title: i18n.getKey('multilanguage') + '(' + clazz + ')',
            refresh: true
        })
    },
    /**
     * 检查是否需要多语言配置
     */
    checkIsNeedMultiLanguage: function (objectId, objectClazz, btnAlwaysShow) {
        var btn = this;
        btn.objectClazz = objectClazz;
        btn.objectId = objectId;
        if (btnAlwaysShow == true) {
            btn.setVisible(btnAlwaysShow);
            btn.setDisabled(!btnAlwaysShow);
        } else {
            if (objectId && objectClazz) {
                //有objectId表示是编辑状态,有objectClazz表示用于查询是否需要配置权限
                var result = btn.getMultiLanguageData(objectClazz);
                if (result) {
                    btn.show();
                    btn.setDisabled(false);
                } else {
                    btn.hide();
                    btn.setDisabled(true);
                }
            } else {
                btn.hide();
                btn.setDisabled(true);
            }
        }
    },
    /**
     * 检查是否需要多语言配置
     * @type {Ext.ux.util.lockConfig}
     */
    getMultiLanguageData: function (objectClazz) {
        var me = this;
        if (me.multiLanguageData) {
            result = me.multiLanguageData;
        } else {
            var url = adminPath + 'api/entityMultilingualConfigs' +
                '?page=1&start=0&limit=25&filter=[{"name":"entityClass","value":"' + objectClazz + '","type":"string"}]';
            var result = null;

            JSAjaxRequest(url, 'GET', false, null, '', function (require, success, response) {
                if (success) {
                    var responseText = Ext.JSON.decode(response.responseText);
                    result = responseText.data.content[0];
                }
            });
        }
        return result;
    },
    initComponent: function () {
        var me = this;
        me.callParent();
        me.checkIsNeedMultiLanguage(me.objectId, me.objectClazz, me.btnAlwaysShow);
    }
})