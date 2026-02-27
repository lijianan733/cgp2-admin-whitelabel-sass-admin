/**
 * Created by nan on 2020/1/6.
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.model.SimplifySBOMMaterialViewType'
])
Ext.onReady(function () {
    var recordId = JSGetQueryString('recordId');
    var productBomConfigId = JSGetQueryString('productBomConfigId');
    var productConfigDesignId = JSGetQueryString('productConfigDesignId');
    var sbomNodeId = JSGetQueryString('sbomNodeId');
    var sbomNode = {
        _id: sbomNodeId,
        clazz: 'com.qpp.cgp.domain.simplifyBom.SBNode'
    };
    var simplifyBomConfig = null;
    var filterData = Ext.JSON.encode([{
        "name": "productConfigDesignId",
        "type": "number",
        "value": productConfigDesignId
    }]);
    Ext.Ajax.request({
        url: encodeURI(adminPath + 'api/simplifyBomController?page=1&start=0&limit=1000&filter=' + filterData),
        method: 'GET',
        headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
        async: false,
        success: function (rep) {
            var response = Ext.JSON.decode(rep.responseText);
            if (response.success) {
                var data = response.data;
                if (Ext.isEmpty(data)) {
                    simplifyBomConfig = null;
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
    var page = Ext.create('Ext.container.Viewport', {
        layout: {
            type: 'fit'
        }
    });
    var tab = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.view.EditTab', {
        recordId: recordId,
        productBomConfigId: productBomConfigId,
        productConfigDesignId: productConfigDesignId,
        sbomNodeId: sbomNodeId,
        sbomNode: sbomNode,
        simplifyBomConfig: simplifyBomConfig
    });
    page.add(tab);
    if (recordId) {
        CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.model.SimplifySBOMMaterialViewType.load(recordId, {
            scope: this,
            failure: function (record, operation) {
                //do something if the load failed
            },
            success: function (record, operation) {
                console.log(record.getData());
                tab.setValue(record.getData());
                //do something if the load succeeded
            },
            callback: function (record, operation) {
                //do something whether the load succeeded or failed
            }
        })
    }
})
