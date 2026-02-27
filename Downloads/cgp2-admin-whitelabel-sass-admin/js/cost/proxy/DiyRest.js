/**
 * @Description:过滤参数全放到url单独处理，不放到filter中
 * @author nan
 * @date 2022/9/14
 */
Ext.define('CGP.cost.proxy.DiyRest', {
    extend: 'Ext.ux.data.proxy.Rest',
    alias: 'proxy.diyrest',
    timeout: 600000,
    //正常的请求方式对应
    actionMethods: {
        create: 'POST',
        read: 'GET',
        update: 'POST',
        destroy: 'POST'
    },
    extraDeal: Ext.emptyFn,
    doRequest: function (operation, callback, scope) {
        var me = this;
        var writer = this.getWriter(),
            filter = this.filter;
        attributeValues = this.attributeValues;
        var request = this.buildRequest(operation);
        if (operation.allowWrite()) {
            request = writer.write(request);
        }
        //合并接口里面所有返回数据
        me.mergeDate(request);
        //如果设置了filter控件，加入filter查询条件
        if (filter && Ext.isFunction(filter.getQuery) && operation.action === 'read') {
            var query = filter.getQuery();
            if (operation.sorters.length > 0)
                request.params.sort = this.encodeSorters(operation.sorters);
            if (Ext.isObject(query) || (Ext.isArray(query) && query.length > 0)) {
                //部分方法POST需要特殊处理
                if (this.getMethod(request) == 'POST') {
                    query.map(function (item) {
                        request.params[item.name] = item.value;
                    });
                    //添加对每个接口的特殊处理
                    this.extraDeal(request, query);
                } else {
                    query.map(function (item) {
                        request.params[item.name] = item.value;
                    });
                }
            }
        }
        Ext.apply(request, {
            binary: this.binary,
            headers: this.headers,
            timeout: this.timeout,
            scope: this,
            callback: this.createRequestCallback(request, operation, callback, scope),
            method: this.getMethod(request),
            disableCaching: false, // explicitly set it to false, ServerProxy handles caching
            failure: function (response, options) {
                if (response.status == 401) {
                    //授权超时  直接跳到登录界面
                    Ext.Msg.alert(i18n.getKey('prompt'), '登录凭证无效，请重新登录！', function callback() {
                        //window.top.location.reload();
                        var loginWin = new Ext.window.Window({
                            closable: false,
                            title: '登录',
                            modal: true,
                            layout: 'border',
                            width: 320,
                            height: 220,
                            items: [Ext.create('CGP.login.view.Login', {
                                bodyStyle: ' padding: 10px 10px;',
                                title: '',
                                region: 'center'
                            })]
                        });
                        loginWin.show();
                    });
                }
                if (response.status == 0) {
                    Ext.Msg.alert("提示", "请求超时:" + adminPath);
                }
            }
        });
        request.headers = request.headers || {};
        Ext.apply(request.headers, {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        });
        Ext.Ajax.request(request);
        return request;
    }
})
