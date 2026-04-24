"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleRuleState(id: string, currentState: boolean) {
  try {
    await prisma.rule.update({
      where: { id },
      data: { isActive: !currentState }
    });
    revalidatePath("/rules");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle rule:", error);
    return { success: false, error: "Database error" };
  }
}

export async function deleteRule(id: string) {
  try {
    await prisma.rule.delete({
      where: { id }
    });
    revalidatePath("/rules");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete rule:", error);
    return { success: false, error: "Database error" };
  }
}

export async function createRule(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const priority = parseInt(formData.get("priority") as string) || 0;
    const conditionParam = formData.get("conditionParam") as string;
    const conditionOperator = formData.get("conditionOperator") as string;
    const conditionValue = formData.get("conditionValue") as string;
    const actionType = formData.get("actionType") as string;
    const actionTarget = formData.get("actionTarget") as string;

    // Construct valid JSON objects for the database schemas
    const conditionsObject = [{
      param: conditionParam,
      operator: conditionOperator,
      value: conditionValue
    }];

    const actionObject = {
      type: actionType,
      target: actionTarget
    };

    await prisma.rule.create({
      data: {
        name,
        priority,
        conditions: JSON.stringify(conditionsObject),
        action: JSON.stringify(actionObject),
        isActive: true,
      }
    });

    revalidatePath("/rules");
    return { success: true };
  } catch (error) {
    console.error("Failed to create rule:", error);
    return { success: false, error: "Database error" };
  }
}
