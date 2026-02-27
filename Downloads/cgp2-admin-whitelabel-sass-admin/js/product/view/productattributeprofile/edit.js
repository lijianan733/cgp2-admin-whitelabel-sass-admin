Ext.onReady(function () {
    var data = {};
    var status = 'create';
    var id = JSGetQueryString('id');
    var sortIndex = JSGetQueryString('sortIndex') || 0;
    console.log(sortIndex);
    if (id) {
        id = Ext.Number.from(id, 0);
        //如果是编辑模式     就通过Ajax.request加载这个产品的信息
        if (id != 0) {
            status = 'edit';
            var requestParam = {
                method: 'GET',
                url: adminPath + 'api/attributeProfile/' + id,
                async: false,
                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                success: function (response) {
                    //data 是一条id为id的产品信息数据
                    var resp = Ext.JSON.decode(response.responseText);
                    if (resp.success) {
                        data = resp.data;
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

    }
    Ext.isEmpty(data.sort) ? (data.sort = sortIndex) : null;
    Ext.create('Ext.container.Viewport', {
        title: i18n.getKey(status) + i18n.getKey("productAttributeProfile"),
        layout: "border",
        defaults: {
            split: true,
            hideCollapseTool: true
        },
        items: [Ext.create('CGP.product.view.productattributeprofile.EditTab', {
            data: data
        })]
    })
});
