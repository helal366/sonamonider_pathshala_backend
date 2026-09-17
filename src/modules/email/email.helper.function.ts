import crypto from "crypto";
import ejs from "ejs";
import path from "path";
import { transporter } from "../../lib/nodemailer.js";
import { envVars } from "../../config/index.js";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";

export const createTemporaryPassword = () => {
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lowercase = "abcdefghijkmnpqrstuvwxyz";
  const numbers = "123456789";
  const symbols = "#@$&*";
  const allCharacters = `${uppercase}${lowercase}${numbers}${symbols}`;
  const passwordCharacters = [
    uppercase[crypto.randomInt(uppercase.length)],
    lowercase[crypto.randomInt(lowercase.length)],
    numbers[crypto.randomInt(numbers.length)],
    symbols[crypto.randomInt(symbols.length)],
  ];

  while (passwordCharacters.length < 6) {
    passwordCharacters.push(
      allCharacters[crypto.randomInt(allCharacters.length)],
    );
  }

  for (let index = passwordCharacters.length - 1; index > 0; index -= 1) {
    const randomIndex = crypto.randomInt(index + 1);
    [passwordCharacters[index], passwordCharacters[randomIndex]] = [
      passwordCharacters[randomIndex],
      passwordCharacters[index],
    ];
  }

  return passwordCharacters.join("");
};

export const sendVerificationResultEmail = async ({
  to,
  templateName,
  subject,
  templateData,
}: {
  to: string;
  templateName: string;
  subject: string;
  templateData: Record<string, string | number>;
}) => {
  const templatePath = path.join(
    process.cwd(),
    `src/templates/${templateName}`,
  );
  const html = await ejs.renderFile(templatePath, {
    ...templateData,
    year: new Date().getFullYear(),
  });

  try {
    await transporter.sendMail({
      from: `"${envVars.EMAIL_SENDER_NAME}" <${envVars.EMAIL_SENDER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send email.";
    throw new AppError(message, StatusCodes.BAD_REQUEST);
  }
};
