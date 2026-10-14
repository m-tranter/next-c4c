import Icon from "./shared/Icon";
import Heading from "./shared/Heading";
import ArrowRight from "./Icons/ArrowRight";
import styles from "./NavPanel.module.css";
import { NavObj } from "@/app/layout";

type Props = {
  navigation: NavObj;
  tasks: NavObj;
  className: string;
};

// ─── Component ────────────────────────────────────────────────────────────────

function NavPanel({ navigation, tasks, className }: Props) {
  const navItems = navigation.links;
  const taskItems = tasks.links;

  return (
    <div className={`${className} print:hidden ${styles.wrapper}`}>
      <div className={styles.sections}>
        {/* ── Main navigation ─────────────────────────────────── */}
        <div className={styles.mainNav}>
          <Heading
            className="font-bold"
            size="h3"
            as="h2"
            id="nav-panel-heading"
          >
            {navigation.title}
          </Heading>
          <nav aria-labelledby="nav-panel-heading">
            <ul className={`list-none mt-6 ${styles.navGrid}`}>
              {navItems.map((item) => (
                <li key={item.sys.id} className={styles.navCard}>
                  <div className={styles.navCardInner}>
                    <Heading size="h5" as="h3">
                      <a
                        className={styles.navCardLink}
                        href={item.url || item.sys.uri || "/"}
                        target="_self"
                      >
                        {item.entryTitle}
                      </a>
                    </Heading>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ── Divider ─────────────────────────────────────────── */}
        <div className={styles.divider} aria-hidden="true" />

        {/* ── Tasks ───────────────────────────────────────────── */}
        <nav className={styles.tasksNav} aria-labelledby="nav-tasks-heading">
          <Heading
            className="font-bold"
            size="h3"
            as="h2"
            id="nav-tasks-heading"
          >
            {tasks.title}
          </Heading>
          <ul className={`list-none mt-6 ${styles.tasksList}`}>
            {taskItems.map((task) => (
              <li key={task.sys.id}>
                <a
                  className={styles.taskLink}
                  href={task.url || task.sys.uri || "/"}
                  target="_self"
                >
                  <span
                    className="
          inline-grid place-items-center w-8 h-8 aspect-square rounded-full p-3 bg-[#f2eff8] text-[#0b0c0c] no-underline transition-all duration-200 ease-in-out hover:bg-[#d5cce8] hover:text-[#212529] focus:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-bg,#fff),0_0_0_5px_var(--color-text,#212529)] text-sm md:text-base leading-6 font-normal font-sans
"
                    aria-hidden="true"
                  >
                    <Icon size="xs">
                      <ArrowRight />
                    </Icon>
                  </span>
                  {task.entryTitle}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default NavPanel;
