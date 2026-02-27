/**
 * @class
 * 产品查询窗口,封装grid显示界面(可添加界面显示字段)，并提供多条件查询（可进行修改，与添加查询控件）
 *
 * ## Basic GridPanel
 *
 *     @example
 *     Ext.create('Ext.data.Store', {
 *         storeId:'simpsonsStore',
 *         fields:['name', 'email', 'phone'],
 *         data:{'items':[
 *             { 'name': 'Lisa',  "email":"lisa@simpsons.com",  "phone":"555-111-1224"  },
 *             { 'name': 'Bart',  "email":"bart@simpsons.com",  "phone":"555-222-1234" },
 *             { 'name': 'Homer', "email":"home@simpsons.com",  "phone":"555-222-1244"  },
 *             { 'name': 'Marge', "email":"marge@simpsons.com", "phone":"555-222-1254"  }
 *         ]},
 *         proxy: {
 *             type: 'memory',
 *             reader: {
 *                 type: 'json',
 *                 root: 'items'
 *             }
 *         }
 *     });
 *
 *     Ext.create('Ext.grid.Panel', {
 *         title: 'Simpsons',
 *         store: Ext.data.StoreManager.lookup('simpsonsStore'),
 *         columns: [
 *             { text: 'Name',  dataIndex: 'name' },
 *             { text: 'Email', dataIndex: 'email', flex: 1 },
 *             { text: 'Phone', dataIndex: 'phone' }
 *         ],
 *         height: 200,
 *         width: 400,
 *         renderTo: Ext.getBody()
 *     });
 *
 * 示例：
 *
 * var productSearch = Ext.create('CGP.common.productsearch.ProductSearchWin',{
 *      //对产品查询界面的按钮进行设置（必须设置执行函数）
 *      bbarCfg:{
 *          //确认按钮配置
 *          btnConfirm: {
 *              text: '确认',
 *              //确认按钮执行函数（必须设置）
 *              handler: function(){
 *                  confirm();
 *              }
 *          }，
 *          //取消按钮配置
 *          btnCancel: {
 *              text: '取消',
 *              //取消按钮执行函数（必须设置）
 *              handler: function(){
 *                  cancel();
 *              }
 *          }
 *      },
 *      //grid配置，已封装部分字段显示列，详细配置请参考{@link CGP.common.productsearch.grid.Panel grid}
 *      gridCfg:{
 *          //必需(为产品页面设置store)
 *          store: store,
 *          columns:[
 *
 *          ]
 *      }，
 *      //filter配置（非必须,已封装部分查询控件，可修改，可添加），{@link CGP.common.productsearch.filter.Panel filter}
 *      filterCfg:{
 *
 *      }
 *
 * })
 *
 * 继承扩展该组件
 * For example:
 *
 *      Ext.define('CGP.test.TestWin',{
 *          extend: 'CGP.common.productsearch.ProductSearchWin',
 *
 *          initComponent: function(){
 *              var me = this;
 *
 *              //grid配置
 *              me.gridCfg= {
 *                  columns : [
 *                      //添加表格显示字段列
 *                      {
 *                          text: i18n.getKey('testColumn'),
 *                          dataIndex: 'testColumn',
 *                           xtype: 'gridcolumn',
 *                          itemId: 'testColumn'
 *                      }]
 *
 *              },
 *              //filter配置
 *              me.filterCfg= {
 *                   height : 90,
 *                      header: false,
 *                      defaults : {
 *                      width : 280
 *                  },
 *                  //对原封装查询控件进行修改
 *                  idFilter:{
 *                      hidden: true
 *                  },
 *                  //添加查询控件
 *                  items : [ ]
 *              },
 *              //bbar配置
 *              me.bbarCfg= {
 *                  //对已有按钮进行配置
 *                  btnConfirm:{text: 'test',
 *                      handler: function(){
 *                      me.controller.test();
 *                  }}
 *              },
 *              me.callParent(arguments);
 *          }
 *      })
 *
 */
Ext.syncRequire(['CGP.common.productsearch.bottombar.Bbar']);
Ext.define("CGP.common.productsearch.ProductSearchWin", {
    extend: 'Ext.window.Window',
    alias: 'widget.productsearchcontainer',
    /**
     * @cfg {Object} filterCfg
     *为产品查询页面组件配置查询控件，已封装部分查询条件（可修改），并可自行添加查询条件
     * {@link CGP.common.productsearch.filter.Panel filter}
     * 已封装的查询控件:
     *
     * - idFilter: id查询控件，xtype: numberfield
     * - typeFilter: type查询控件，xtype: combo
     * - skuFilter: sku查询控件, xtype: textfield
     * - nameFilter: name查询控件, xtype: textfield
     * - modelFilter： modelFilter查询控件, xtype: textfield
     * - websiteFilter: website查询控件,xtype: combo
     * - mainCategoryFilter: 主类目查询控件, xtype: treecombo
     * - subCategoryFilter: 产品类目查询控件, xtype: treecombo
     *
     */
    filterCfg: null,
    /**
     * @cfg {Object} bbarCfg
     * {@link CGP.common.productsearch.bottombar.Bbar Bbar}
     * 产品查询窗口按钮控件配置
     *
     *  - btnConfirm: {Object} 确认按钮
     *  - btnCancel: {Object} 取消按钮
     *
     * for example:
     *
     *  bbarCfg:{
     *      //确认按钮配置
     *      btnConfirm:{
     *          text: '确认',
     *          handler: function(){
     *              confirm();
     *          }
     *      },
     *      //取消按钮配置
     *      btnCancel:{
     *          text: '取消',
     *          handler: function(){
     *              cancel();
     *          }
     *      }
     *  }
     *
     */
    bbarCfg: null,
    filter: null,
    grid: null,
    /**
     * @cfg {number} websiteId
     * 网站Id，当传入该值时，会查询该网站下的产品，主类目和产品类目的store也会进行该网站值的过滤
     */
    websiteId: null,
    /**
     * @cfg {Ext.grid.panel/Object} gridCfg
     * 为产品查询页面组件配置显示字段，以疯转部分显示
     *{@link CGP.common.productsearch.grid.Panel grid}
     *显示产品信息的grid，已封装的产品显示字段：
     *
     *  - 产品名称
     *  - 产品编号
     *  - 类型
     *  - sku
     *  - 模型
     *  - 主类目
     *  - 产品类目
     *
     * 可添加gird显示字段
     *详细配置请参考{@link CGP.common.productsearch.grid.Panel grid}
     */
    gridCfg: null,
    layout: "border",
    width: 870,
    height: 550,
    modal: true,
    /**
     * @cfg {Ext.data.Model[]} filterData
     * 选中的产品记录集合，用于在产品查询页面进行过滤
     */
    filterDate: null,

    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.filterCfg = Ext.merge({
            searchActionHandler: function () {
                me.grid.getStore().loadPage(1);
            },
            itemId: 'filter',
            websiteId: me.websiteId,
            region: 'north',
            partnerId: me.partnerId
        }, me.filterCfg);
        me.filter = Ext.create("CGP.common.productsearch.filter.Panel", me.filterCfg);

        me.bbarCfg = Ext.merge({
            xtype: 'uxproductwintoolbar',
            region: 'south',
            itemId: 'uxproductwintoolbar'
        }, me.bbarCfg);

        me.gridCfg = Ext.merge({
            filter: me.filter,
            itemId: 'grid',
            region: 'center'
        }, me.gridCfg);
        me.grid = Ext.create("CGP.common.productsearch.grid.Panel", me.gridCfg);

        me.add(me.filter);
        me.add(me.grid);
        me.add(me.bbarCfg);

    },
    /**
     *为窗口底部添加按钮
     * @param {Ext.button.Button} button
     * {@link Ext.button.Button button}: 传入button实例的配置项
     */
    addButton: function (button) {
        var me = this;
        var toolbar = me.down('uxproductwintoolbar');
        toolbar.add(button);
    },
    /**
     * 获取选中记录
     * @returns {*|Ext.data.Model[]}
     */
    getSelection: function () {
        var me = this;
        var selectRecords = me.down('grid').getSelectionModel().getSelection();
        return selectRecords;
    }
});