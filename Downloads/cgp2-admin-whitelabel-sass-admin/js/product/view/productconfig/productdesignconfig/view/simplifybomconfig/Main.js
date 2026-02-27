Ext.Loader.syncRequire([]);
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.Main', {
    extend: 'Ext.container.Viewport',
    layout: 'border',
    modal: true,
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('productMaterialViewType');
        me.productConfigDesignId = parseInt(JSGetQueryString('productConfigDesignId'));
        me.productBomConfigId = parseInt(JSGetQueryString('productBomConfigId'));
        me.sbomNodeId = parseInt(JSGetQueryString('sbomNodeId'));
        var sbomNode = {
            _id: me.sbomNodeId,
            clazz: 'com.qpp.cgp.domain.simplifyBom.SBNode'
        };
        var simplifyBomConfig = null;//产品对应的简易bom
        var filterData = Ext.JSON.encode([{
            "name": "productConfigDesignId",
            "type": "number",
            "value": me.productConfigDesignId
        }]);
        //获取或者新建sbom配置
        Ext.Ajax.request({
            url: encodeURI(adminPath + 'api/simplifyBomController?page=1&start=0&limit=1000&filter=' + filterData),
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            async: false,
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                    var data = response.data;
                    if (Ext.isEmpty(data.content)) {
                        Ext.Ajax.request({
                            url: adminPath + 'api/simplifyBomController',
                            method: 'POST',
                            jsonData: {
                                clazz: 'com.qpp.cgp.domain.simplifyBom.SimplifyBomConfig',
                                productConfigDesignId: me.productConfigDesignId,
                                sbom: sbomNode,
                                simplifyMaterialViewTypes: []
                            },
                            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                            success: function (rep) {
                                var response = Ext.JSON.decode(rep.responseText);
                                if (response.success) {
                                    simplifyBomConfig = response.data;
                                } else {
                                    Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                                }
                            },
                            failure: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            }
                        });
                    } else {
                        simplifyBomConfig = data.content[0];
                    }
                } else {
                    Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
        var grid = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.view.ManageSMVTGrid', {
            region: 'center',
            sbomNodeId: me.sbomNodeId,
            productConfigDesignId: me.productConfigDesignId,
            productBomConfigId: me.productBomConfigId,
            simplifyBomConfig: simplifyBomConfig,
            sbomNode: sbomNode

        });
        me.items = [grid];
        me.callParent(arguments);
        me.on('afterrender', function () {
            var page = this;
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    }
});
