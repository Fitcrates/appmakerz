export const getContactTemplate = (name: string, message: string) => `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Nowa wiadomość – AppCrates</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0f1e;font-family:'Segoe UI',Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d0f1e;padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px;width:100%;background-color:#131629;border-radius:12px;overflow:hidden;border:1px solid #1e2240;">

          <!-- Top accent bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#00e5c3,#00b5f5);height:3px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:36px 48px 28px;border-bottom:1px solid #1e2240;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="font-size:22px;font-weight:700;letter-spacing:0.5px;color:#ffffff;">
                      App<span style="color:#00e5c3;">Crates</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-size:11px;letter-spacing:2px;color:#4a5080;text-transform:uppercase;">FULLSTACK DEVELOPER</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:44px 48px 20px;">

              <!-- Label -->
              <p style="margin:0 0 20px;font-size:11px;letter-spacing:3px;color:#00e5c3;text-transform:uppercase;">Nowa wiadomość</p>

              <!-- Greeting -->
              <p style="margin:0 0 10px;font-size:15px;color:#8892b0;line-height:1.6;">
                Cześć <strong style="color:#c9d1e8;">AppCrates</strong>,
              </p>
              <p style="margin:0 0 32px;font-size:15px;color:#8892b0;line-height:1.6;">
                Otrzymałeś nową wiadomość od <strong style="color:#00e5c3;">${name}</strong>:
              </p>

              <!-- Message block -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:40px;">
                <tr>
                  <!-- Teal left border -->
                  <td style="width:3px;background:linear-gradient(180deg,#00e5c3,#00b5f5);border-radius:2px;vertical-align:top;">&nbsp;</td>
                  <td style="background-color:#0d0f1e;border-radius:0 8px 8px 0;padding:20px 24px;">
                    <!-- Quote icon -->
                    <p style="margin:0 0 10px;font-size:28px;line-height:1;color:#00e5c3;opacity:0.4;">&ldquo;</p>
                    <p style="margin:0;font-size:15px;color:#c9d1e8;line-height:1.8;font-style:italic;">
                      ${message.replace(/\n/g, '<br/>')}
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding:24px 48px 32px;border-top:1px solid #1e2240;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width:3px;background:linear-gradient(180deg,#00e5c3,#00b5f5);border-radius:2px;">&nbsp;</td>
                  <td style="padding-left:16px;">
                    <p style="margin:0 0 4px;font-size:14px;color:#c9d1e8;font-weight:600;">AppCrates</p>
                    <p style="margin:0;font-size:12px;color:#4a5080;letter-spacing:1px;text-transform:uppercase;">Pozdrawiamy · appcrates.pl</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 48px;background-color:#0d0f1e;border-top:1px solid #1e2240;">
              <p style="margin:0;font-size:11px;color:#2e3455;text-align:center;line-height:1.7;">
                Ta wiadomość została wysłana automatycznie przez formularz kontaktowy na stronie AppCrates.<br/>
                Prosimy nie odpowiadać bezpośrednio na tego maila.
              </p>
            </td>
          </tr>

          <!-- Bottom accent bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#00e5c3,#00b5f5);height:2px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

export const getNewsletterTemplate = (to_email: string, categories: string, blog_title: string, blog_url: string, author_name: string, unsubscribe_url: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Blog Post – AppCrates</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0f1e;font-family:'Segoe UI',Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d0f1e;padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px;width:100%;background-color:#131629;border-radius:12px;overflow:hidden;border:1px solid #1e2240;">

          <!-- Top accent bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#00e5c3,#00b5f5);height:3px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:36px 48px 28px;border-bottom:1px solid #1e2240;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <!-- Logo -->
                    <span style="font-size:22px;font-weight:700;letter-spacing:0.5px;color:#ffffff;">
                      App<span style="color:#00e5c3;">Crates</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-size:11px;letter-spacing:2px;color:#4a5080;text-transform:uppercase;">FULLSTACK DEVELOPER</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero section -->
          <tr>
            <td style="padding:44px 48px 20px;">
              <!-- Label -->
              <p style="margin:0 0 12px;font-size:11px;letter-spacing:3px;color:#00e5c3;text-transform:uppercase;">New Blog Post</p>

              <!-- Greeting -->
              <p style="margin:0 0 28px;font-size:15px;color:#8892b0;line-height:1.6;">
                Cześć! <strong style="color:#c9d1e8;">${to_email}</strong>,
              </p>

              <!-- Divider line with category -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                <tr>
                  <td style="width:24px;border-top:1px solid #00e5c3;vertical-align:middle;">&nbsp;</td>
                  <td style="padding:0 12px;white-space:nowrap;vertical-align:middle;">
                    <span style="font-size:11px;letter-spacing:2px;color:#00e5c3;text-transform:uppercase;">${categories}</span>
                  </td>
                  <td style="border-top:1px solid #1e2240;vertical-align:middle;">&nbsp;</td>
                </tr>
              </table>

              <!-- Blog title -->
              <h1 style="margin:0 0 20px;font-size:28px;font-weight:700;color:#ffffff;line-height:1.3;letter-spacing:-0.3px;">
                "${blog_title}"
              </h1>

              <p style="margin:0 0 36px;font-size:15px;color:#8892b0;line-height:1.7;">
               Właśnie opublikowałem nowy post na blogu. Jeżeli temat Cię interesuje, jest wart przeczytania. Mam nadzieję, że Ci się spodoba!
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:44px;">
                <tr>
                  <td style="background:linear-gradient(135deg,#00e5c3,#00b5f5);border-radius:6px;padding:1px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:#131629;border-radius:5px;padding:0 2px;">
                          <a href="${blog_url}"
                            style="display:inline-block;padding:14px 32px;font-size:13px;font-weight:600;letter-spacing:2px;text-decoration:none;color:#00e5c3;text-transform:uppercase;">
                            &#9658;&nbsp; Przeczytaj post
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Signature row -->
          <tr>
            <td style="padding:24px 48px 32px;border-top:1px solid #1e2240;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width:3px;background:linear-gradient(180deg,#00e5c3,#00b5f5);border-radius:2px;">&nbsp;</td>
                  <td style="padding-left:16px;">
                    <p style="margin:0 0 4px;font-size:14px;color:#c9d1e8;font-weight:600;">${author_name}</p>
                    <p style="margin:0;font-size:12px;color:#4a5080;letter-spacing:1px;text-transform:uppercase;">Fullstack Developer · AppCrates</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 48px;background-color:#0d0f1e;border-top:1px solid #1e2240;">
              <p style="margin:0;font-size:11px;color:#2e3455;text-align:center;line-height:1.7;">
                You are receiving this email because you subscribed to blog updates from AppCrates.<br/>
                <a href="${unsubscribe_url}" style="color:#4a5080;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

          <!-- Bottom accent bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#00e5c3,#00b5f5);height:2px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>
`;
