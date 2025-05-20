import { config } from "@/config";
import { appState } from "@/state";
import { type MessageBoxOptions, app, dialog } from "electron";
import { z } from "zod";

const licenseKeyActivationSuccessSchema = z.object({
	activated: z.literal(true),
	error: z.null(),
	licenseKey: z.object({
		key: z.string(),
	}),
});

const licenseKeyActivationErrorSchema = z.object({
	activated: z.literal(false),
	error: z.enum([
		"license_key_invalid",
		"license_key_disabled",
		"license_key_expired",
		"max_activations_reached",
	]),
});

function showLicenseKeyActivationError(
	options: Omit<MessageBoxOptions, "type" | "message">,
) {
	return dialog.showMessageBox({
		type: "warning",
		message: "Failed to activate license key",
		...options,
	});
}

export async function activateLicenseKey(input: {
	licenseKey: string;
	force?: boolean;
}): Promise<{ success: boolean }> {
	config.set("licenseKey", input.licenseKey);

	return { success: true };
}

const licenseKeyValidationSuccessSchema = z.object({
	valid: z.literal(true),
	error: z.null(),
	licenseKey: z.object({
		key: z.string(),
	}),
});

const licenseKeyValidationErrorSchema = z.object({
	valid: z.literal(false),
	error: z.enum([
		"license_key_invalid",
		"license_key_expired",
		"license_key_disabled",
		"license_key_not_activated_for_instance",
	]),
});

const licenseKeyValidationErrorMessages: Record<
	z.infer<typeof licenseKeyValidationErrorSchema>["error"],
	string
> = {
	license_key_invalid: "The license key is invalid",
	license_key_disabled: "The license key has been disabled",
	license_key_expired: "The license key has expired",
	license_key_not_activated_for_instance:
		"The license key is activated on another device",
};

function showLicenseKeyValidationError(
	options: Omit<MessageBoxOptions, "type" | "message">,
) {
	return dialog.showMessageBox({
		type: "warning",
		message: "Failed to validate license key",
		...options,
	});
}

export async function validateLicenseKey() {
	appState.isLicenseKeyValid = true;
	app.relaunch();
}
