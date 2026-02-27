/**
 * @Description:
 * @author nan
 * @date 2022/10/13
 */
Ext.define("CGP.common.conditionv2.config.Config", {
    statics: {
        map: {
            ExpressionDto: {
                controller: 'CGP.common.conditionv2.controller.other.ExpressionDtoController',
                modelName: 'CGP.common.conditionv2.model.other.ExpressionDtoModel',
            },
            ValueExDto: {
                controller: 'CGP.common.conditionv2.controller.other.ValueExDtoController',
                modelName: 'CGP.common.conditionv2.model.other.ValueExDtoModel',
            },

            TemplateFunction: {
                controller: 'CGP.common.conditionv2.controller.template.TemplateFunctionController',
                modelName: 'CGP.common.conditionv2.model.template.TemplateFunctionModel'
            },
            CustomizeFunction: {
                controller: 'CGP.common.conditionv2.controller.template.CustomizeFunctionController',
                modelName: 'CGP.common.conditionv2.model.template.CustomizeFunctionModel'
            },

            CalculationValue: {
                controller: 'CGP.common.conditionv2.controller.value.CalculationValueController',
                modelName: 'CGP.common.conditionv2.model.value.CalculationValueModel'
            },
            ConstantValue: {
                controller: 'CGP.common.conditionv2.controller.value.ConstantValueController',
                modelName: 'CGP.common.conditionv2.model.value.ConstantValueModel'
            },
            ContextPathValue: {
                controller: 'CGP.common.conditionv2.controller.value.ContextPathValueController',
                modelName: 'CGP.common.conditionv2.model.value.ContextPathValueModel'
            },
            ProductAttributeValue: {
                controller: 'CGP.common.conditionv2.controller.value.ProductAttributeValueController',
                modelName: 'CGP.common.conditionv2.model.value.ProductAttributeValueModel'
            },
            PropertyPathValue: {
                controller: 'CGP.common.conditionv2.controller.value.PropertyPathValueController',
                modelName: 'CGP.common.conditionv2.model.value.PropertyPathValueModel'
            },

            CompareOperation: {
                controller: 'CGP.common.conditionv2.controller.logical.CompareOperationController',
                modelName: 'CGP.common.conditionv2.model.logical.CompareOperationModel'
            },
            IntervalOperation: {
                controller: 'CGP.common.conditionv2.controller.logical.IntervalOperationController',
                modelName: 'CGP.common.conditionv2.model.logical.IntervalOperationModel'
            },
            LogicalOperation: {
                controller: 'CGP.common.conditionv2.controller.logical.LogicalOperationController',
                modelName: 'CGP.common.conditionv2.model.logical.LogicalOperationModel'
            },
            RangeOperation: {
                controller: 'CGP.common.conditionv2.controller.logical.RangeOperationController',
                modelName: 'CGP.common.conditionv2.model.logical.RangeOperationModel'
            },

            IfCondition: {
                controller: 'CGP.common.conditionv2.controller.other.IfConditionController',
                modelName: 'CGP.common.conditionv2.model.other.IfConditionModel'
            },
            ReturnStructure: {
                controller: 'CGP.common.conditionv2.controller.other.ReturnStructureController',
                modelName: 'CGP.common.conditionv2.model.other.ReturnStructureModel'
            },
            IfElseStructure: {
                controller: 'CGP.common.conditionv2.controller.other.IfElseStructureController',
                modelName: 'CGP.common.conditionv2.model.other.IfElseStructureModel'
            }
        }
    }
})

