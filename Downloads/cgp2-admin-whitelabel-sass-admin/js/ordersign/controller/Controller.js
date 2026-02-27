Ext.syncRequire([
    'CGP.ordersign.view.batchsign.OrderLineItem'
])
Ext.define('CGP.ordersign.controller.Controller', {
    /**
     * 转换时间格式
     * @time number 时间
     */
    getTime: (time) => time ? Ext.Date.format(new Date(+time), 'Y-m-d G:i:s') : '未查询到时间信息',

    /**
     * 保留字符串小数点后两位
     * @value string 数据
     */
    getFixedString: (value) => value.substr(0, value.indexOf('.') + 1 + 2),

    /**
     * 去除字符串双引号
     * @value string 数据
     */
    removeStringStyle: (value) => value.replace("\"", "").replace("\"", ""),

    /**
     * 行列展开 创建dom
     * @record 记录
     */
    expandBody: function (record) {
        var me = this,
            orderId = record.get('id'),
            orderLineItemDom = document.getElementById('order-line-item-' + orderId);

        (!orderLineItemDom.innerHTML) && me.createOrderLineItemDetail(orderLineItemDom, record);
    },

    /**
     * 创建dom
     * @dom 渲染到的dom
     * @order 记录
     */
    createOrderLineItemDetail: function (dom, order) {
        var orderId = order.get('id'),
            orderNumber = order.get('orderNumber');
        Ext.create('CGP.ordersign.view.batchsign.OrderLineItem', {
            renderTo: dom,
            order: order,
            orderNumber: orderNumber,
            store: Ext.create('CGP.ordersign.store.SalesOrderItemStore', {
                proxy: {
                    type: 'uxrest',
                    url: adminPath + 'api/orders/' + orderId + '/lineItemsV2',
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                },
            }),
        });
    },

    /**
     * 业务网站销售信息请求
     * @url string 请求地址
     * @method string 请求方式
     * @data object 请求体
     */
    postRequest: 0,
    JSOrderInfoRequest: function (url, method, data) {
        var result = null,
            me = this,
            successMsg = {
                GET: '',
                POST: i18n.getKey('addsuccessful'),
                PUT: i18n.getKey('modifySuccess'),
            };
        method === 'POST' && me.postRequest > 0 ? method = 'PUT' : null;
        method === 'POST' ? me.postRequest++ : null;

        JSSetLoading(true);
        JSAjaxRequest(url, method, false, data, successMsg[method], function (require, success, response) {
            JSSetLoading(false);
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText;
                    method === 'POST' ? me.postRequest++ : null;
                }
            }
        })
        return result;
    },

    /**
     * 获取字段
     * @data object 源数据
     * @field array 字段   //getDataField(a, ['object', 'tt', 'a', {bb: 0}, 'a'])
     */
    getDataField: function (data, field) {
        var result = data;
        //确定内容获取深度
        field.forEach(item => {
            function object() {
                for (var key in item) {
                    result = result[key][item[key]];
                }
            }

            (typeof item === 'object') ? object() : (result = result[item]);
        })
        return result;
    },

    /**
     * 获取字符串格式
     * @color string 字体颜色
     * @isBold boolean 是否加粗
     * @text string 文本
     * @fontSize number 文本大小
     */
    getTitleBold: function (color, isBold, text, fontSize = 15) {
        var bold = isBold ? 'bold' : 'none';
        return "<font style= 'font-size:" + fontSize + "px;color:" + color + ";font-weight:" + bold + "'>" + text + '</font>'
    }
})