[English](README.md) | [ไทย](README.th.md)

# Project Prompt Builder

เลือกสแต็กโปรเจกต์ของคุณแบบเห็นภาพ แล้วสร้างพรอมป์ตสำหรับ AI coding agent ที่คัดลอกไปวางได้ทันที
ขั้นตอนการใช้งาน: **เลือก → ตั้งค่า → สร้าง → คัดลอก**

## ภาพรวม

Project Prompt Builder (PPB) คือเว็บแอปหน้าเดียวที่ทำงานฝั่งไคลเอนต์ทั้งหมด เปลี่ยนสิ่งที่คุณเลือก
เกี่ยวกับเทคโนโลยีและโน้ตโปรเจกต์คร่าว ๆ ให้กลายเป็นบรีฟ Markdown ที่เป็นระบบ แบบกำหนดผลลัพธ์ได้แน่นอน
(deterministic) พร้อมวางลงใน AI coding agent เช่น Claude Code, Cursor, GitHub Copilot หรือ Codex

นักพัฒนาที่เริ่มโปรเจกต์ใหม่มักเสียเวลากับการแปลงตัวเลือกสแต็กให้เป็นบรีฟที่ agent เอาไปทำงานต่อได้
พรอมป์ตที่เขียนสด ๆ มักลืมเรื่องสถาปัตยกรรม ขัดแย้งกันเอง (เช่น `sqlc` คู่กับ MongoDB) และระบุรายละเอียด
ด้านการทดสอบ การ deploy และมาตรฐานคุณภาพไม่ชัดเจน PPB แก้ปัญหานี้ด้วยการจับคู่ตัวจัดสแต็กแบบมีโครงสร้าง
เข้ากับ engine ที่คอยเตือนชุดเทคโนโลยีที่เข้ากันไม่ดี และ pipeline แบบเทมเพลตที่ให้พรอมป์ตเดิมเสมอเมื่ออินพุตเดิม

ตัวแอป **ไม่มี LLM ไม่มี backend และไม่มีฐานข้อมูล** ทุกอย่างทำงานในเบราว์เซอร์และบันทึกใน `localStorage`

## ฟีเจอร์

- **21 หมวดเทคโนโลยี** แบ่งเป็นการ์ดแบบเลือกได้ตัวเดียว (radio) และแบบเลือกได้หลายตัว (toggle)
- **12 พรีเซ็ตที่มีชื่อ** บวกตัวเลือกเริ่มจากศูนย์ที่ตั้งค่าตั้งต้นให้ (แก้ไขต่อได้เสมอ)
- **7 ช่องข้อมูลความต้องการแบบข้อความธรรมชาติ**: ชื่อโปรเจกต์, คำอธิบาย, กลุ่มผู้ใช้เป้าหมาย,
  ฟีเจอร์หลัก, ความต้องการทางธุรกิจ, ความต้องการทางเทคนิค และคำสั่งเพิ่มเติม
- **3 โหมดพรอมป์ต**: Basic, Standard และ Production (ดูรายละเอียดด้านล่าง)
- **ตัวอย่างพรอมป์ตแบบสด** อัปเดตทันทีขณะตั้งค่า พร้อมจำนวนคำ จำนวนตัวอักษร จำนวนข้อทักท้วง
  และป้าย "Edited" เมื่อคุณแก้ไขผลลัพธ์ด้วยมือ
- **คำเตือนเรื่องความเข้ากันได้แบบไม่บล็อก** อธิบายปัญหาและกระโดดไปยังหมวดที่เกี่ยวข้องได้ทันที
  ไม่มีอะไรบล็อกการใช้งาน ยกเว้นเพดานเลือกฐานข้อมูลได้ไม่เกิน 2 รายการ
- **แก้ไขด้วยมือ**: แก้พรอมป์ตที่สร้างได้ในหน้าเว็บ บันทึกไว้ และย้อนกลับเป็นเวอร์ชันที่สร้างอัตโนมัติได้ทุกเมื่อ
- **ค้นหา / กรอง** เทคโนโลยีตามชื่อหรือคำอธิบาย
- **คัดลอกไปยังคลิปบอร์ด** พร้อมกลไกสำรองผ่าน textarea ซ่อนไว้สำหรับสภาพแวดล้อมที่จำกัดสิทธิ์
- **ลิงก์แชร์**: การเปิด URL ที่มีพารามิเตอร์ `?c=` (JSON แบบ base64url) จะนำการตั้งค่าทั้งชุดมาใช้
  โดยชนะสถานะที่บันทึกไว้ มี helper สำหรับเข้ารหัสลิงก์อยู่ใน `lib/share/codec.ts` แต่ตอนนี้ยังไม่มีปุ่มใน UI สำหรับสร้างลิงก์
- **ธีมมืด / สว่าง** ตรวจจับค่าจากระบบปฏิบัติการและจำค่าไว้ใน localStorage
- **เลย์เอาต์ตอบสนอง**: บนเดสก์ท็อปแสดงสองบานหน้าต่างเคียงกัน บนมือถือสลับด้วยแท็บพร้อมแถบคัดลอกแบบติดขอบล่าง
- **บันทึกอัตโนมัติ**: การตั้งค่าอยู่รอดหลังรีเฟรชผ่าน persisted zustand store
- **SEO/GEO**: metadata, การ์ด Open Graph และ Twitter, JSON-LD ชนิด `SoftwareApplication`,
  `sitemap.xml`, `robots.txt` และไฟล์ `public/llms.txt` ที่ให้คำแนะนำแก่ผู้ช่วย AI

## เทคโนโลยีที่ใช้

| ส่วน          | ตัวเลือก                                                                      |
| ------------- | ----------------------------------------------------------------------------- |
| เฟรมเวิร์ก    | [Next.js](https://nextjs.org) 16.4.0 (App Router, Turbopack)                  |
| UI library    | [React](https://react.dev) 19.3.0                                             |
| ภาษา          | TypeScript 5 (strict, `noEmit`)                                               |
| สไตล์         | [Tailwind CSS](https://tailwindcss.com) v4 พร้อม `@tailwindcss/turbopack`      |
| State         | [zustand](https://zustand-demo.pmnd.rs) 5 พร้อม middleware `persist`           |
| ไอคอน         | [lucide-react](https://lucide.dev)                                            |
| เครื่องมือ UI | `class-variance-authority`, `clsx`, `tailwind-merge` (helper `cn`)            |
| การทดสอบ      | [Vitest](https://vitest.dev) 5 + Testing Library + jsdom                       |
| Linting       | ESLint 9 ร่วมกับ `eslint-config-next`                                          |

### โหมดพรอมป์ต

| โหมด           | เนื้อหา                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------- |
| **Basic**      | พรอมป์ตสั้น: บทบาท ภาพรวมโปรเจกต์ สแต็กเทคโนโลยีพร้อมโน้ตการเชื่อมต่อ ความต้องการ และสิ่งที่ต้องส่งมอบ |
| **Standard**   | เพิ่มคำแนะนำด้านสถาปัตยกรรม agent skills กฎการพัฒนา คุณภาพโค้ด การทดสอบ และการ deploy             |
| **Production** | เพิ่มความปลอดภัย การตรวจสอบข้อมูล/จัดการข้อผิดพลาด การบันทึก log/observability, CI/CD และประสิทธิภาพ/การขยายระบบ พร้อมบล็อกคำสั่งสำหรับ AI agent ปิดท้าย |

## โครงสร้างโปรเจกต์

```
.
├── app/                      # Next.js App Router
│   ├── layout.tsx            # โครงหลัก ฟอนต์ metadata, JSON-LD และสคริปต์ธีม
│   ├── page.tsx              # หน้าหลัก (บานหน้าต่างตั้งค่า + พรอมป์ต)
│   ├── globals.css           # import Tailwind, โทเคนธีม, keyframe animation
│   ├── robots.ts             # route ของ robots.txt
│   └── sitemap.ts            # route ของ sitemap.xml
├── components/
│   ├── configurator/         # PresetBar, CategorySection, OptionCard, RequirementsForm,
│   │                         # CustomSkillsInput และ shell ของ Configurator
│   ├── prompt/               # ModeSwitch, ValidationList, PromptPreview
│   ├── ui/                   # primitive: Button, Card, ConfirmDialog
│   ├── shared-config-loader.tsx  # นำ Share Link `?c=` มาใช้ตอนโหลด
│   └── theme-toggle.tsx
├── lib/
│   ├── data/                 # catalog.ts (หมวด/ตัวเลือก), presets.ts, logos.ts
│   ├── store/useConfig.ts    # persisted zustand store ของ Configuration
│   ├── prompt/               # builder.ts, stack-intel.ts, useGeneratedPrompt.ts
│   ├── compat/rules.ts       # engine กฎความเข้ากันได้แบบเตือนเท่านั้น
│   ├── share/codec.ts        # เข้ารหัส/ถอดรหัส base64url + sanitizer สำหรับ `?c=`
│   ├── export/clipboard.ts   # คัดลอกคลิปบอร์ดพร้อมกลไกสำรอง
│   ├── domain.ts             # type และ helper ของโดเมนที่ใช้ร่วมกัน
│   ├── selections.ts         # helper ค้นหาการเลือก และชุด backend แยกตาม runtime
│   ├── site.ts               # หา canonical site URL
│   └── utils.ts              # helper รวมคลาส `cn`
├── docs/
│   ├── adr/                  # Architecture Decision Records 0001–0004
│   └── agents/               # เอกสาร issue-tracker, triage-label และ domain
├── public/
│   ├── logos/                # ไฟล์ SVG โลโก้แบรนด์ (แบบสว่าง + แบบมืดถ้ามี)
│   └── llms.txt              # คำแนะนำสำหรับผู้ช่วย AI
├── scripts/fetch-logos.mjs   # ดึงโลโก้แบรนด์จาก svgl.app มาเก็บใหม่
├── .scratch/                 # issue tracker แบบ markdown ในเครื่อง (spec และ ticket)
├── CONTEXT.md                # คำศัพท์ของโปรเจกต์ที่ล็อกไว้
└── AGENTS.md                 # คำสั่งสำหรับ agent ในโปรเจกต์นี้
```

## เริ่มต้นใช้งาน

### สิ่งที่ต้องมีก่อน

- Node.js (เวอร์ชันที่เข้ากับ Next.js 16)
- npm (มีไฟล์ `package-lock.json` อยู่ในโปรเจกต์)

### ติดตั้งและรัน

```bash
npm install
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

### สคริปต์

| สคริปต์               | หน้าที่                                            |
| --------------------- | -------------------------------------------------- |
| `npm run dev`         | เปิด development server (Turbopack)                |
| `npm run build`       | build สำหรับ production                            |
| `npm run start`       | เสิร์ฟผลลัพธ์จาก production build                  |
| `npm run test`        | ชุดทดสอบ Vitest (unit + component)                 |
| `npm run lint`        | ESLint                                             |
| `npm run typecheck`   | `tsc --noEmit`                                     |
| `npm run fetch-logos` | ดึงโลโก้เทคโนโลยีจาก svgl.app มาเก็บใหม่           |

## ตัวแปรสภาพแวดล้อม

| ชื่อ                   | หน้าที่                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | canonical site URL ที่ใช้กับ metadata, sitemap และลิงก์แชร์ ถ้าไม่ตั้งค่าจะใช้ `https://project-prompt-builder.vercel.app` |

ดูเทมเพลตได้ที่ `.env.example` ห้ามคอมมิตค่าความลับจริงลงในโปรเจกต์

## วิธีใช้งาน

1. **เลือก** — เลือกพรีเซ็ต (หรือเริ่มจากศูนย์) แล้วเลือกเทคโนโลยี หมวดแบบเลือกตัวเดียวทำงานเหมือน
   ปุ่ม radio ส่วนหมวดแบบหลายตัวกดสลับได้ และหมวดฐานข้อมูลจำกัดไม่เกิน 2 ตัวเลือก
2. **ตั้งค่า** — กรอกช่องความต้องการทั้งเจ็ด ช่อง custom agent skills พิมพ์ได้บรรทัดละหนึ่งรายการ
   (เครื่องหมายสแลชนำหน้าจะถูกตัดออก)
3. **สร้าง** — ตัวอย่างพรอมป์ตสร้างใหม่แบบ deterministic ทุกครั้งที่เปลี่ยนแปลง สลับโหมดเพื่อปรับความละเอียด
4. **คัดลอก** — คัดลอกพรอมป์ต หรือแก้ไขด้วยมือก่อนก็ได้ การล้างการตั้งค่าจะมีกล่องยืนยัน

### หมวดและการเลือก

- **เลือกได้ตัวเดียว**: Project Type, Frontend, Language, ORM/Database Tools, Cache,
  Authentication, Validation, API, Architecture, Package Manager
- **เลือกได้หลายตัว**: Backend, UI, State Management, Testing, Load Testing, Deployment,
  CI/CD, Observability, Message Queue, AI Agent Skills
- **เลือกได้หลายตัวแต่จำกัดที่ 2**: Database (การเลือกตัวที่สองจะถูกเตือนว่าเป็นสถาปัตยกรรมหลายฐานข้อมูล
  แต่ไม่ถูกบล็อก)

### ลิงก์แชร์

Share Link คือ URL ที่พารามิเตอร์ `?c=` เก็บ Configuration ทั้งชุดเป็น JSON แบบ base64url
การเปิดลิงก์จะนำการตั้งค่านั้นมาใช้ โดยชนะสถานะที่บันทึกไว้ ถ้า payload ใช้งานไม่ได้จะถูกละเว้น
และใช้สถานะที่บันทึกไว้แทน การเข้ารหัสมีให้ผ่าน `encodeShareConfig` แต่ยังไม่มี UI เปิดใช้อยู่ในตอนนี้

### การบันทึกและธีม

การตั้งค่าถูกเก็บใน localStorage ภายใต้คีย์ `ppb-config-v1` (การเลือก ความต้องการ โหมด และ custom skills)
ส่วนค่าธีมถูกเก็บภายใต้คีย์ `ppb-theme`

## การทำงานภายใน

ตรรกะของพรอมป์ตและความเข้ากันได้อยู่ใน `lib/` เป็น pure function ทั้งหมด จึงทดสอบได้โดยไม่ต้องพึ่ง UI
จุดเชื่อมต่อหลักมีสองจุด:

- `buildPrompt(config)` ใน `lib/prompt/builder.ts` — pipeline แบบเทมเพลตที่กำหนดผลลัพธ์ได้แน่นอน
  (normalize → โน้ต stack-intel → สร้างแต่ละหัวข้อ → ประกอบตามโหมด) ไม่เรียก LLM
- `evaluateRules(selections)` ใน `lib/compat/rules.ts` — engine กฎแบบเตือนเท่านั้น คืนค่าเป็น
  `ValidationIssue[]` (เช่น `sqlc` กับฐานข้อมูลที่ไม่ใช่ SQL, Vercel กับ backend ที่ไม่ใช่ Node,
  tRPC ที่ไม่มี backend เป็น Node)

คอมโพเนนต์ UI ถูกทำให้เรียบง่ายและเรนเดอร์บนจุดเชื่อมต่อเหล่านี้ ดูคำศัพท์ที่ล็อกไว้ใน `CONTEXT.md`
และดูการตัดสินใจที่บันทึกไว้ใน `docs/adr/`

## การทดสอบ

เขียนด้วย Vitest และ Testing Library รันในสภาพแวดล้อม jsdom เปิด globals และตั้งค่า
`@testing-library/jest-dom` ไว้ใน `vitest.setup.ts` ส่วน alias `@` ชี้ไปที่รากของโปรเจกต์
ไฟล์ทดสอบอยู่ข้างโค้ดที่ทดสอบ (`*.test.ts` / `*.test.tsx`) ทั้งใน `lib/` และ `components/`

```bash
npm run test
```

## การ deploy

```bash
npm run build
```

deploy ขึ้น Vercel ได้ทันที (ไม่มี backend ไม่มีฐานข้อมูล) ตั้งค่า `NEXT_PUBLIC_SITE_URL`
เป็น URL production ที่เป็น canonical เพื่อให้ metadata และ sitemap ถูกต้อง

## หมายเหตุ

- **คำศัพท์ของโดเมน** ถูกกำหนดไว้ใน `CONTEXT.md` (Category, Option, Configuration, Preset,
  Requirements, PromptMode, GeneratedPrompt, ValidationIssue, Agent Skill, Custom Skill, Share Link)
- **การตัดสินใจด้านสถาปัตยกรรม** บันทึกไว้ใน `docs/adr/` (0001–0004)
- **การติดตามงาน** ใช้ markdown tracker ในเครื่องใต้ `.scratch/` ดูรายละเอียดที่ `docs/agents/`
- **โลโก้** ดึงมาจาก [svgl.app](https://svgl.app) รีเฟรชได้ด้วย `npm run fetch-logos`
  ตัวเลือกที่ไม่มีโลโก้จะแสดงเป็นแท่งตัวอักษร
- **คำสั่งสำหรับ agent** ของโปรเจกต์นี้อยู่ใน `AGENTS.md`

## เครดิต

โลโก้เทคโนโลยีดึงมาจาก [svgl.app](https://svgl.app)
