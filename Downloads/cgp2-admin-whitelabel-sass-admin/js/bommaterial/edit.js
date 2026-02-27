Ext.onReady(function () {

    var page = new Ext.container.Viewport({
        title: 'Create Material',
        layout: 'border'

    });

    var status = 'creating';
    var data;
    var id = Ext.urlDecode(location.search.substring(1))['id'];
    if (id) {
        id = Ext.Number.from(id, 0);
        //如果是编辑模式     就通过Ajax.request加载这个产品的信息
        if (id != 0) {
            status = 'editing';
            var requestParam = {
                method: 'GET',
                url: adminPath + 'api/admin/bom/schema/materials/' + id,
                async: false,
                params: {
                    access_token: Ext.util.Cookies.get('token')
                },
                success: function (response) {
                    //data 是一条id为id的material信息数据
                    data = Ext.JSON.decode(response.responseText).data;


                }
            };
            Ext.Ajax.request(requestParam);
        }
    }
    var controller = Ext.create("CGP.bommaterial.edit.controller.Controller");
    controller.initPanel(page, data);
});